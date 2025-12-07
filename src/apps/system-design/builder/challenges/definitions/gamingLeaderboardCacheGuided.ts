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
 * Gaming Leaderboard Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a real-time gaming leaderboard with Redis sorted sets.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (sorted sets, score updates, top-N queries, etc.)
 *
 * Key Concepts:
 * - Redis Sorted Sets (ZADD, ZINCRBY, ZRANGE, ZREVRANGE)
 * - Real-time ranking algorithms
 * - Atomic score updates
 * - Top-N leaderboard queries
 * - Cache-aside pattern for persistence
 * - Handling concurrent score updates
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const gamingLeaderboardRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time gaming leaderboard system like those in Fortnite, League of Legends, or Candy Crush",

  interviewer: {
    name: 'Alex Martinez',
    role: 'Senior Engineering Manager at GameTech Studios',
    avatar: '🎮',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-ranking',
      category: 'functional',
      question: "What's the core functionality players need from this leaderboard?",
      answer: "Players need to see their rank and compete:\n\n1. **View rankings** - See top players globally or in their region\n2. **Real-time updates** - Rankings update instantly when scores change\n3. **Personal rank** - 'You are #1,247 out of 10 million players'\n4. **Top-N queries** - Show top 10, top 100, or top 1000 players",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Leaderboards are all about fast reads and rank queries - this screams Redis Sorted Sets",
    },
    {
      id: 'score-updates',
      category: 'functional',
      question: "How do player scores get updated?",
      answer: "When a player finishes a match:\n\n1. **Score update** - Game server sends new score (points, wins, rating)\n2. **Atomic increment** - Some games add to existing score (total points)\n3. **Replacement** - Other games replace score (highest rating)\n4. **Multiple games** - Player can play multiple matches simultaneously",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Score updates must be atomic - concurrent matches can't corrupt data",
    },
    {
      id: 'leaderboard-types',
      category: 'clarification',
      question: "Are there different types of leaderboards?",
      answer: "Yes, players want to see multiple leaderboards:\n\n1. **Global leaderboard** - All players worldwide\n2. **Regional leaderboards** - Players in North America, Europe, Asia, etc.\n3. **Friends leaderboard** - Just your friends' ranks\n\nFor MVP, let's focus on global and regional. Friends can be v2.",
      importance: 'important',
      insight: "Multiple leaderboards = multiple sorted sets in Redis",
    },
    {
      id: 'time-windows',
      category: 'clarification',
      question: "Do leaderboards reset? Daily, weekly, all-time?",
      answer: "Most games have multiple time windows:\n\n1. **All-time leaderboard** - Never resets\n2. **Season leaderboard** - Resets every 3 months\n3. **Weekly leaderboard** - Resets every Monday\n\nFor MVP, let's support all-time and one seasonal leaderboard. We can add weekly later.",
      importance: 'important',
      insight: "Time windows = separate sorted sets with TTL or scheduled resets",
    },
    {
      id: 'tie-breaking',
      category: 'clarification',
      question: "What happens when players have the same score?",
      answer: "When players tie:\n\n1. **Primary sort by score** (higher is better)\n2. **Tiebreaker by timestamp** - Player who achieved the score first ranks higher\n\nRedis sorted sets use score as the primary key, so we'll encode timestamp into the score.",
      importance: 'important',
      insight: "Tiebreaking requires encoding multiple values into the sorted set score",
    },
    {
      id: 'rank-display',
      category: 'clarification',
      question: "What information is shown for each player on the leaderboard?",
      answer: "For each player, show:\n\n1. **Rank** - Position (1, 2, 3, ...)\n2. **Player name** - Display name\n3. **Score** - Points/rating\n4. **Change indicator** - Up/down arrows showing rank change\n\nFor MVP, let's skip change tracking - that requires historical snapshots.",
      importance: 'nice-to-have',
      insight: "Rank change tracking needs periodic snapshots - complex, defer to v2",
    },

    // SCALE & NFRs
    {
      id: 'throughput-players',
      category: 'throughput',
      question: "How many active players should we design for?",
      answer: "100 million active players globally, with 10 million concurrent players during peak hours",
      importance: 'critical',
      learningPoint: "Massive scale - similar to Fortnite or League of Legends",
    },
    {
      id: 'throughput-score-updates',
      category: 'throughput',
      question: "How many score updates per second?",
      answer: "About 50,000 score updates per second at peak. Each match generates 10-100 score updates (depending on game mode).",
      importance: 'critical',
      calculation: {
        formula: "50K updates/sec to sorted sets",
        result: "~50K ZADD/ZINCRBY ops/sec",
      },
      learningPoint: "High write throughput - Redis sorted sets are perfect for this",
    },
    {
      id: 'throughput-leaderboard-reads',
      category: 'throughput',
      question: "How many players view leaderboards per second?",
      answer: "About 200,000 leaderboard views per second (top-100 queries). Most players check after each match.",
      importance: 'critical',
      calculation: {
        formula: "200K reads/sec, mostly ZREVRANGE(0, 99)",
        result: "~200K top-N queries/sec",
      },
      learningPoint: "Read-heavy workload (4x more reads than writes)",
    },
    {
      id: 'payload-leaderboard-size',
      category: 'payload',
      question: "How many players can be on a single leaderboard?",
      answer: "Global leaderboard can have up to 100 million players. Regional leaderboards have 10-30 million each.",
      importance: 'critical',
      calculation: {
        formula: "100M players × 50 bytes (ID + score) = 5GB",
        result: "~5GB for global leaderboard in Redis",
      },
      learningPoint: "Sorted sets scale well - Redis can handle 100M+ members",
    },
    {
      id: 'latency-rank-query',
      category: 'latency',
      question: "How fast should leaderboard queries be?",
      answer: "p99 latency under 50ms for top-100 queries. Players expect instant leaderboard updates.",
      importance: 'critical',
      learningPoint: "Redis sorted sets provide O(log N + M) lookups - perfect for top-N queries",
    },
    {
      id: 'latency-score-update',
      category: 'latency',
      question: "How fast should score updates be processed?",
      answer: "p99 latency under 100ms for score updates. Game servers can tolerate slight delay.",
      importance: 'important',
      learningPoint: "Writes can be slightly slower than reads - still need to be fast",
    },
    {
      id: 'consistency',
      category: 'consistency',
      question: "Do all players need to see exactly the same rankings instantly?",
      answer: "Eventual consistency is acceptable. It's okay if rankings take 1-2 seconds to propagate to all regions. Players understand rankings update frequently.",
      importance: 'important',
      insight: "Eventual consistency allows us to use regional Redis clusters with async replication",
    },
    {
      id: 'reliability',
      category: 'availability',
      question: "What happens if the leaderboard service goes down?",
      answer: "Leaderboards should have 99.9% uptime. If Redis crashes, we need to recover from database backups. Players can tolerate a few minutes of stale data during recovery.",
      importance: 'critical',
      learningPoint: "Redis persistence (AOF + RDB snapshots) + database backup for disaster recovery",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-ranking', 'score-updates', 'throughput-score-updates', 'latency-rank-query'],
  criticalFRQuestionIds: ['core-ranking', 'score-updates'],
  criticalScaleQuestionIds: ['throughput-score-updates', 'throughput-leaderboard-reads', 'latency-rank-query'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: View real-time rankings',
      description: 'Players can view top-N players on global/regional leaderboards',
      emoji: '🏆',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Query personal rank',
      description: 'Players can see their current rank (e.g., "You are #1,247")',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Real-time rank updates',
      description: 'Rankings update instantly when player scores change',
      emoji: '⚡',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Atomic score updates',
      description: 'Game servers can update player scores atomically (add/replace)',
      emoji: '🔢',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million active players',
    writesPerDay: '4.3 billion score updates/day',
    readsPerDay: '17.3 billion leaderboard views/day',
    peakMultiplier: 3,
    readWriteRatio: '4:1 (read-heavy)',
    calculatedWriteRPS: { average: 50000, peak: 150000 },
    calculatedReadRPS: { average: 200000, peak: 600000 },
    maxPayloadSize: '~5GB per leaderboard (100M players)',
    storagePerRecord: '~50 bytes per player (ID + score + metadata)',
    storageGrowthPerYear: '~20GB (mostly static player count)',
    redirectLatencySLA: 'p99 < 50ms (top-N queries)',
    createLatencySLA: 'p99 < 100ms (score updates)',
  },

  architecturalImplications: [
    'Use Redis Sorted Sets for O(log N) rank lookups',
    'Cache-first architecture - Redis is primary, database is backup',
    'Regional Redis clusters for low latency',
    'Redis persistence (AOF + RDB) for crash recovery',
    'Read replicas for scaling top-N queries',
  ],

  outOfScope: [
    'Friends leaderboards (social graph complexity)',
    'Historical rank tracking (requires time-series storage)',
    'Weekly/daily leaderboards (focus on all-time + seasonal)',
    'Anti-cheat detection (separate system)',
    'Player profiles (only scores, not full profiles)',
  ],

  keyInsight: "Leaderboards are a perfect use case for Redis Sorted Sets - they're built exactly for this! Fast rank lookups, atomic score updates, and top-N queries are all O(log N).",
};

// =============================================================================
// STEP 1: The First Match - Storing Player Scores
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎮',
  scenario: "Your gaming startup just launched! Players are finishing their first matches.",
  hook: "After each match, game servers send player scores. You need to store them somewhere. Where do you put 100 million player scores?",
  challenge: "Build a simple system to store player scores. Just make it work - don't worry about speed yet!",
  illustration: 'first-match',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "You stored your first player scores!",
  achievement: "Basic score storage working",
  metrics: [
    { label: 'Storage', after: 'Database connected' },
    { label: 'Players', after: '1,000 scores stored' },
  ],
  nextTeaser: "But how do you find who's in the top 10?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Starting Simple: Database Storage',
  conceptExplanation: `When building any system, start with the simplest thing that works:

**Database Table: player_scores**
- player_id (primary key)
- score (integer)
- updated_at (timestamp)

This works! But there's a problem...

**To get top 10 players:**
\`\`\`sql
SELECT * FROM player_scores
ORDER BY score DESC
LIMIT 10;
\`\`\`

**Problem**: With 100M players, sorting the entire table on every query is SLOW.
- Sorting 100M rows: ~10 seconds
- Players expect results in 50ms
- You need an index... or something better!`,

  whyItMatters: 'Understanding why databases struggle with leaderboards helps you appreciate why Redis Sorted Sets exist - they solve this exact problem!',

  realWorldExample: {
    company: 'Fortnite',
    scenario: '350 million players, leaderboards update every match',
    howTheyDoIt: 'Redis Sorted Sets for real-time rankings + DynamoDB for persistence. Sorted sets provide O(log N) rank lookups instead of O(N log N) table scans.',
  },

  famousIncident: {
    title: 'Pokémon GO Leaderboard Disaster',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'Pokémon GO tried to show gym leaderboards using traditional database queries. With 100M+ active players, leaderboard queries took 30+ seconds and crashed the database under load. They had to disable leaderboards entirely for months.',
    lessonLearned: 'Traditional databases with ORDER BY are not built for real-time leaderboards at scale. Use data structures designed for ranking: sorted sets, skip lists, or tree-based indexes.',
    icon: '💥',
  },

  keyPoints: [
    'Start simple: Database table with player_id and score',
    'ORDER BY is too slow for 100M rows (O(N log N) sort)',
    'You need a data structure optimized for ranking',
    'This is why Redis Sorted Sets exist!',
  ],

  diagram: `
┌──────────────┐     ┌──────────────────────┐
│ Game Server  │────▶│  Database            │
│              │     │  player_scores       │
└──────────────┘     │  - player_id         │
                     │  - score             │
                     │  - updated_at        │
                     └──────────────────────┘

Query: SELECT * FROM player_scores ORDER BY score DESC LIMIT 10
Problem: Scans 100M rows! ❌
`,

  keyConcepts: [
    { title: 'Baseline', explanation: 'Start with simple database storage', icon: '💾' },
    { title: 'ORDER BY Problem', explanation: 'Sorting 100M rows is O(N log N) - too slow!', icon: '🐌' },
  ],

  quickCheck: {
    question: 'Why is ORDER BY too slow for leaderboards?',
    options: [
      'Databases don\'t support sorting',
      'It scans and sorts all 100M rows on every query',
      'SQL is slower than NoSQL',
      'It doesn\'t support descending order',
    ],
    correctIndex: 1,
    explanation: 'ORDER BY must scan the entire table and sort it (O(N log N)). With 100M rows, this takes seconds - way too slow for real-time leaderboards!',
  },
};

const step1: GuidedStep = {
  id: 'leaderboard-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'FR-1: Store player scores in a database',
    taskDescription: 'Build Client → App Server → Database to store player scores',
    componentsNeeded: [
      { type: 'client', reason: 'Represents game servers sending scores', displayName: 'Game Server' },
      { type: 'app_server', reason: 'Leaderboard API service', displayName: 'Leaderboard API' },
      { type: 'database', reason: 'Stores player scores', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Game Server', to: 'Leaderboard API', reason: 'Send score updates' },
      { from: 'Leaderboard API', to: 'Database', reason: 'Store scores persistently' },
    ],
    successCriteria: ['Connect game servers to API to database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Start with the basic flow: Game Server → API → Database',
    level2: 'Add Client (game server), App Server (leaderboard API), and Database, then connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: The Rankings - Enter Redis Sorted Sets
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🚀',
  scenario: "Players are asking: 'Who's #1? What's the top 10?' But your database takes 10 seconds to answer!",
  hook: "You need to show top-100 leaderboards instantly. Database ORDER BY is way too slow. What's the solution?",
  challenge: "Add Redis with Sorted Sets - the perfect data structure for leaderboards!",
  illustration: 'sorted-sets',
};

const step2Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Lightning-fast rankings!",
  achievement: "Redis Sorted Sets handling leaderboard queries",
  metrics: [
    { label: 'Top-100 Query', before: '10 seconds', after: '5ms' },
    { label: 'Rank Lookup', before: 'Table scan', after: 'O(log N)' },
  ],
  nextTeaser: "But what happens when millions of players update scores simultaneously?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Redis Sorted Sets: Built for Rankings',
  conceptExplanation: `Redis Sorted Sets are the perfect data structure for leaderboards.

**What is a Sorted Set?**
- A collection of unique members (player IDs)
- Each member has a score (points/rating)
- Members are automatically sorted by score
- Implemented as a skip list (like a balanced tree)

**Key Operations (all O(log N)):**
\`\`\`redis
ZADD leaderboard 1500 player:alice    # Add/update score
ZADD leaderboard 2000 player:bob
ZADD leaderboard 1800 player:charlie

ZREVRANGE leaderboard 0 9            # Top 10 players
# Returns: [bob, charlie, alice]

ZREVRANK leaderboard player:alice    # Get rank
# Returns: 2 (0-indexed, so 3rd place)

ZINCRBY leaderboard 200 player:alice # Atomic increment
# Alice now has 1700 points
\`\`\`

**Why Sorted Sets Win:**
✅ O(log N) inserts and lookups
✅ Automatic sorting - no ORDER BY needed
✅ Top-N queries are O(log N + M) where M is result size
✅ Atomic operations - safe for concurrent updates
✅ In-memory - microsecond latency`,

  whyItMatters: 'Sorted Sets are specifically designed for ranking use cases. This is not a hack - it\'s exactly what they were built for!',

  realWorldExample: {
    company: 'League of Legends',
    scenario: '180 million monthly players, constant rank updates',
    howTheyDoIt: 'Redis Sorted Sets for real-time leaderboards per region. Each region has its own sorted set. ZREVRANGE gets top players, ZRANK gets individual ranks.',
  },

  famousIncident: {
    title: 'Candy Crush Leaderboard Outage',
    company: 'King (Candy Crush)',
    year: '2013',
    whatHappened: 'Candy Crush tried to scale leaderboards using MySQL with indexed ORDER BY queries. During a viral surge, leaderboard queries created a 50,000-query backlog, locking up the database. The entire game went down for 6 hours.',
    lessonLearned: 'Even with database indexes, ORDER BY doesn\'t scale for millions of concurrent leaderboard queries. Redis Sorted Sets handle the same load with millisecond latency.',
    icon: '🍬',
  },

  keyPoints: [
    'Sorted Sets maintain automatic ordering by score',
    'All operations are O(log N) - lightning fast even with 100M players',
    'Top-N queries (ZREVRANGE) are extremely efficient',
    'Atomic operations prevent race conditions',
    'In-memory = microsecond latency (vs milliseconds for database)',
  ],

  diagram: `
Redis Sorted Set: "global_leaderboard"
┌────────────────────────────────────┐
│  Score    Member                   │
├────────────────────────────────────┤
│  5000  ─▶ player:bob        (#1)   │
│  4800  ─▶ player:charlie    (#2)   │
│  4500  ─▶ player:alice      (#3)   │
│  4200  ─▶ player:diana      (#4)   │
│  ...                               │
│  1500  ─▶ player:zack   (#100M)    │
└────────────────────────────────────┘

Operations:
ZREVRANGE leaderboard 0 9     → Top 10 (O(log N + 10))
ZREVRANK leaderboard alice    → Rank #3 (O(log N))
ZINCRBY leaderboard 500 alice → Add 500 points (O(log N))
`,

  keyConcepts: [
    { title: 'Skip List', explanation: 'Internal structure - like a multi-level linked list for O(log N) search', icon: '🔗' },
    { title: 'ZADD', explanation: 'Add/update a member with a score - O(log N)', icon: '➕' },
    { title: 'ZREVRANGE', explanation: 'Get top-N members (descending order) - O(log N + M)', icon: '📋' },
    { title: 'ZREVRANK', explanation: 'Get rank of a specific member - O(log N)', icon: '🔢' },
    { title: 'ZINCRBY', explanation: 'Atomically increment score - O(log N)', icon: '⚛️' },
  ],

  quickCheck: {
    question: 'What is the time complexity of getting top 100 players from a 100M player sorted set?',
    options: [
      'O(N) - must scan all players',
      'O(N log N) - must sort all players',
      'O(log N) - skip list traversal',
      'O(1) - constant time',
    ],
    correctIndex: 2,
    explanation: 'ZREVRANGE is O(log N + M) where M is result size. With M=100, it\'s essentially O(log N) - incredibly fast even with 100M players!',
  },
};

const step2: GuidedStep = {
  id: 'leaderboard-step-2',
  stepNumber: 2,
  frIndex: 1,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1: Query top-N players in under 50ms',
    taskDescription: 'Add Redis Cache with Sorted Sets for fast leaderboard queries',
    componentsNeeded: [
      { type: 'client', reason: 'Game servers', displayName: 'Game Server' },
      { type: 'app_server', reason: 'Leaderboard API', displayName: 'Leaderboard API' },
      { type: 'cache', reason: 'Redis with Sorted Sets', displayName: 'Redis (Sorted Sets)' },
      { type: 'database', reason: 'Persistent storage backup', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Game Server', to: 'Leaderboard API', reason: 'Send score updates' },
      { from: 'Leaderboard API', to: 'Redis (Sorted Sets)', reason: 'Fast leaderboard queries' },
      { from: 'Leaderboard API', to: 'Database', reason: 'Backup persistence' },
    ],
    successCriteria: ['Add Redis Cache for sorted sets', 'Connect API to both Redis and Database'],
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
    level1: 'Add Redis Cache between API and Database for fast sorted set operations',
    level2: 'Add Cache component and connect App Server to both Cache and Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 3: Personal Ranks - Finding "Your Position"
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔍',
  scenario: "Players want to know: 'What's MY rank?' Not just the top 10.",
  hook: "A player with 1,500 points asks: 'Am I ranked #1,247 or #1,248?' You need to find their exact position among 100M players!",
  challenge: "Implement ZREVRANK to get a player's exact rank in O(log N) time!",
  illustration: 'rank-query',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Personal rank queries working!",
  achievement: "Players can see their exact position instantly",
  metrics: [
    { label: 'Rank Query', after: '< 10ms' },
    { label: 'Complexity', after: 'O(log N)' },
  ],
  nextTeaser: "But what happens when 50,000 players finish matches at the same time?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'ZREVRANK: Finding Exact Position',
  conceptExplanation: `Players don't just want to see top 10 - they want to know THEIR rank.

**ZREVRANK Operation:**
\`\`\`redis
ZREVRANK global_leaderboard player:alice
# Returns: 1246 (0-indexed, so rank #1,247)
\`\`\`

**How It Works:**
- Sorted sets maintain an internal skip list structure
- Skip list allows O(log N) traversal to any position
- ZREVRANK counts how many players have higher scores

**Implementation in Your API:**
\`\`\`python
def get_player_rank(player_id):
    rank = redis.zrevrank('global_leaderboard', player_id)
    if rank is None:
        return "Not ranked yet"
    return rank + 1  # Convert to 1-indexed
\`\`\`

**Range Queries Around Player:**
\`\`\`redis
# Show player + 5 above and 5 below
ZREVRANK player:alice  # Get rank = 1246
ZREVRANGE leaderboard 1241 1251  # Get 5 above + player + 5 below
\`\`\`

This is perfect for showing "You're #1,247 - here are players nearby!"`,

  whyItMatters: 'Personal rank is crucial for engagement. Players want to see their progress and compete with players near their level.',

  realWorldExample: {
    company: 'Clash of Clans',
    scenario: 'Shows "You are ranked #4,521 in your clan" instantly',
    howTheyDoIt: 'ZREVRANK on clan sorted sets. Each clan has a sorted set with ~50 members. Query is under 1ms.',
  },

  keyPoints: [
    'ZREVRANK returns 0-indexed rank - add 1 for display',
    'O(log N) complexity - fast even with 100M players',
    'Can combine with ZREVRANGE to show nearby players',
    'Returns None if player not in set - handle gracefully',
  ],

  diagram: `
Player's Rank Query:
┌──────────────────────────────────────┐
│  ZREVRANK global_leaderboard alice   │
└──────────────────────────────────────┘
                  ↓
        Skip List Traversal
                  ↓
┌────────────────────────────────────┐
│  Score    Member         Rank      │
├────────────────────────────────────┤
│  5000  ─▶ bob            #1        │
│  4800  ─▶ charlie        #2        │
│  ...                               │
│  4500  ─▶ alice          #1,247 ✓  │
│  ...                               │
└────────────────────────────────────┘

Result: rank = 1246 (0-indexed)
Display: "You are ranked #1,247"
`,

  keyConcepts: [
    { title: '0-Indexed', explanation: 'ZREVRANK returns 0-based rank - add 1 for human display', icon: '0️⃣' },
    { title: 'Nearby Players', explanation: 'Use rank ± N with ZREVRANGE to show context', icon: '👥' },
  ],

  quickCheck: {
    question: 'What does ZREVRANK return if the player is not in the sorted set?',
    options: [
      'Returns 0',
      'Returns -1',
      'Returns None/null',
      'Throws an error',
    ],
    correctIndex: 2,
    explanation: 'ZREVRANK returns None (or null) if the member doesn\'t exist. Always check for this before displaying rank!',
  },
};

const step3: GuidedStep = {
  id: 'leaderboard-step-3',
  stepNumber: 3,
  frIndex: 2,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-2: Query player\'s exact rank in under 50ms',
    taskDescription: 'Implement ZREVRANK for personal rank queries (no architecture changes needed)',
    successCriteria: [
      'Redis Sorted Sets support ZREVRANK for O(log N) rank lookups',
      'API returns player rank + nearby players',
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
    level1: 'No architecture changes needed - just implement ZREVRANK in your API',
    level2: 'Architecture is already correct - this step teaches ZREVRANK usage',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Score Updates - Atomic Increments
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🏃',
  scenario: "50,000 matches finish every second. Game servers are flooding your API with score updates!",
  hook: "Player Alice finishes 3 matches at the same time across different game servers. Each adds 100 points. She should get +300 total, but you're only seeing +100! Race condition!",
  challenge: "Use ZINCRBY for atomic score updates - no more lost points!",
  illustration: 'concurrent-updates',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚛️',
  message: "Atomic score updates working!",
  achievement: "No more lost points from race conditions",
  metrics: [
    { label: 'Concurrent Updates', before: 'Race conditions', after: 'Atomic ✓' },
    { label: 'Data Integrity', before: '95%', after: '100%' },
  ],
  nextTeaser: "But your single Redis instance can only handle 50,000 writes/sec. What happens at 150,000?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'ZINCRBY: Atomic Score Updates',
  conceptExplanation: `When multiple game servers update the same player's score simultaneously, you need atomicity.

**The Problem: Race Condition**
\`\`\`python
# ❌ BAD: Read-Modify-Write race condition
current_score = redis.zscore('leaderboard', 'alice')  # Read: 1000
new_score = current_score + 100                       # Modify: 1100
redis.zadd('leaderboard', {alice: new_score})         # Write: 1100

# If two servers do this simultaneously:
# Server 1: Read 1000 → Write 1100
# Server 2: Read 1000 → Write 1100  (should be 1200!)
# Result: Only one update counted! ❌
\`\`\`

**The Solution: ZINCRBY (Atomic)**
\`\`\`redis
ZINCRBY leaderboard 100 player:alice
# Atomically adds 100 to alice's score
# Multiple simultaneous ZINCRBY = all counted ✓
\`\`\`

**Why It's Atomic:**
- Redis is single-threaded - commands execute one at a time
- ZINCRBY is a single command - no interleaving
- All concurrent updates are queued and processed sequentially

**When to Use ZADD vs ZINCRBY:**
- **ZINCRBY**: Total points games (add to existing score)
  - Example: "You earned 100 XP!" → ZINCRBY
- **ZADD**: Rating/ELO games (replace score)
  - Example: "Your new rating is 1500" → ZADD`,

  whyItMatters: 'Race conditions corrupt data silently. Players lose progress and don\'t know why. Atomic operations guarantee correctness.',

  realWorldExample: {
    company: 'Fortnite',
    scenario: 'Players can be in multiple matches simultaneously (different game modes)',
    howTheyDoIt: 'ZINCRBY for XP accumulation (atomic increments). Each match completion increments total XP without race conditions.',
  },

  famousIncident: {
    title: 'Clash Royale Score Duplication Bug',
    company: 'Supercell',
    year: '2016',
    whatHappened: 'A bug in Clash Royale\'s leaderboard update logic caused non-atomic score updates. During a tournament, players discovered they could quit and rejoin matches to duplicate trophy gains. Some players gained thousands of illegitimate trophies before Supercell noticed.',
    lessonLearned: 'Always use atomic operations for score updates. Read-modify-write patterns are dangerous in concurrent systems. Redis ZINCRBY guarantees atomicity.',
    icon: '🐛',
  },

  keyPoints: [
    'Redis is single-threaded - commands execute atomically',
    'ZINCRBY atomically increments scores - no race conditions',
    'ZADD replaces scores - use for rating systems',
    'Never do read-modify-write from application code',
    'Multiple concurrent ZINCRBY operations all succeed correctly',
  ],

  diagram: `
Concurrent Score Updates (Atomic):

Server 1                    Server 2
   ↓                           ↓
ZINCRBY +100             ZINCRBY +100
   ↓                           ↓
┌────────────────────────────────────┐
│         Redis (Single Thread)      │
│  Queue: [ZINCRBY +100, ZINCRBY +100]│
│  Execute sequentially:             │
│    1000 → 1100 → 1200 ✓            │
└────────────────────────────────────┘

Result: 1200 (correct!)

Read-Modify-Write (Race Condition):
Server 1                    Server 2
   ↓                           ↓
READ: 1000               READ: 1000
   ↓                           ↓
CALC: 1100               CALC: 1100
   ↓                           ↓
WRITE: 1100              WRITE: 1100
   ↓                           ↓
Result: 1100 (wrong! should be 1200) ❌
`,

  keyConcepts: [
    { title: 'Single-Threaded', explanation: 'Redis executes one command at a time - natural atomicity', icon: '🧵' },
    { title: 'ZINCRBY', explanation: 'Atomic increment - no read-modify-write needed', icon: '⚛️' },
    { title: 'ZADD', explanation: 'Set/replace score - use for rating systems', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why is ZINCRBY safe for concurrent updates?',
    options: [
      'It uses database transactions',
      'It locks the entire sorted set',
      'Redis executes it atomically as a single command',
      'It uses optimistic locking',
    ],
    correctIndex: 2,
    explanation: 'Redis is single-threaded and executes each command atomically. ZINCRBY is a single command, so multiple concurrent calls are queued and executed one at a time - no race conditions!',
  },
};

const step4: GuidedStep = {
  id: 'leaderboard-step-4',
  stepNumber: 4,
  frIndex: 3,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-4: Atomic score updates with ZINCRBY',
    taskDescription: 'Implement atomic score increments (no architecture changes needed)',
    successCriteria: [
      'Use ZINCRBY for atomic score increments',
      'Handle concurrent updates safely',
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
    level1: 'No architecture changes needed - just implement ZINCRBY for atomic updates',
    level2: 'Architecture is already correct - this step teaches atomic operations',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Traffic Surge - Horizontal Scaling
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your game just got featured at E3! Traffic spikes from 50K to 150K score updates per second!",
  hook: "Your single Redis instance maxes out at 80K ops/sec. Writes are queuing up, latency is spiking to 500ms. Players are seeing stale ranks!",
  challenge: "Scale horizontally with a Load Balancer and multiple API servers!",
  illustration: 'traffic-surge',
};

const step5Celebration: CelebrationContent = {
  emoji: '📈',
  message: "You survived the surge!",
  achievement: "Horizontally scaled to handle 150K+ writes/sec",
  metrics: [
    { label: 'Throughput', before: '50K ops/sec', after: '150K ops/sec' },
    { label: 'Latency p99', before: '500ms', after: '50ms' },
  ],
  nextTeaser: "But what happens when Redis crashes? All those ranks are in RAM!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers = More Capacity',
  conceptExplanation: `One Redis instance handles ~80K ops/sec. You need 150K. What do you do?

**Option 1: Vertical Scaling (Bigger Machine)**
- Get a bigger Redis server (more CPU/RAM)
- Limit: Single Redis instance maxes out around 100K-200K ops/sec
- Expensive and hits ceiling quickly

**Option 2: Horizontal Scaling (More Machines)**
- Add more API servers behind a load balancer
- Each API server handles a portion of traffic
- Load balancer distributes 150K writes across 3+ API servers
- Each API server talks to the same Redis instance

**Load Balancer Distribution:**
\`\`\`
150K requests/sec
       ↓
Load Balancer
    ↙  ↓  ↘
  50K 50K 50K  (3 API servers)
    ↘  ↓  ↙
    Redis
\`\`\`

**Important**: Redis itself is still single instance (single-threaded).
The API servers are what scale horizontally. Each server sends ~50K ops/sec to Redis.`,

  whyItMatters: 'Horizontal scaling is how you handle viral growth. When traffic spikes 10x, you add more servers - not rebuild the system.',

  realWorldExample: {
    company: 'League of Legends',
    scenario: 'World Championship finals: 100M+ viewers, massive leaderboard traffic spikes',
    howTheyDoIt: 'Auto-scaling API servers behind AWS ELB. During normal hours: 10 servers. During Worlds finals: 200+ servers. Same Redis cluster handles all traffic.',
  },

  famousIncident: {
    title: 'Among Us Sudden Viral Surge',
    company: 'InnerSloth',
    year: '2020',
    whatHappened: 'Among Us went from 500 concurrent players to 1.5 million in a month due to viral Twitch streams. Their single API server and database crashed. Lobbies failed, leaderboards broke. Took weeks to add load balancers and scale horizontally.',
    lessonLearned: 'Design for horizontal scaling from day one. Load balancers and stateless API servers let you handle viral growth by adding capacity, not rewriting code.',
    icon: '🚀',
  },

  keyPoints: [
    'Horizontal scaling: Add more servers for more capacity',
    'Load balancer distributes traffic across API servers',
    'Stateless API servers: Each server can handle any request',
    'Redis is still single instance (shared state)',
    'Auto-scaling: Automatically add/remove servers based on load',
  ],

  diagram: `
                    ┌──────────────┐
                    │Load Balancer │
                    └──────┬───────┘
                           │ 150K req/s
              ┌────────────┼────────────┐
              ↓            ↓            ↓
         ┌────────┐   ┌────────┐   ┌────────┐
         │API Srv1│   │API Srv2│   │API Srv3│
         └───┬────┘   └───┬────┘   └───┬────┘
             │50K         │50K         │50K
             └────────────┼────────────┘
                          ↓
                   ┌─────────────┐
                   │Redis Sorted │
                   │    Sets     │
                   └─────────────┘
`,

  keyConcepts: [
    { title: 'Stateless', explanation: 'API servers don\'t store data - state is in Redis/DB', icon: '🔄' },
    { title: 'Load Balancing', explanation: 'Distribute traffic evenly across servers', icon: '⚖️' },
    { title: 'Auto-Scaling', explanation: 'Automatically add servers when traffic spikes', icon: '📈' },
  ],

  quickCheck: {
    question: 'Why can you horizontally scale API servers but not Redis (easily)?',
    options: [
      'Redis is written in C, API servers in Python',
      'Redis is single-threaded, API servers are multi-threaded',
      'API servers are stateless, Redis holds shared state',
      'Redis costs more than API servers',
    ],
    correctIndex: 2,
    explanation: 'API servers are stateless - any server can handle any request. Redis holds shared state (the sorted set), so all API servers must talk to the same Redis. Scaling Redis requires sharding, which is more complex.',
  },
};

const step5: GuidedStep = {
  id: 'leaderboard-step-5',
  stepNumber: 5,
  frIndex: 4,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'NFR-S1: Handle 150K score updates per second',
    taskDescription: 'Add Load Balancer in front of API servers for horizontal scaling',
    componentsNeeded: [
      { type: 'client', reason: 'Game servers', displayName: 'Game Server' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Leaderboard API (multiple instances)', displayName: 'Leaderboard API' },
      { type: 'cache', reason: 'Redis Sorted Sets', displayName: 'Redis' },
      { type: 'database', reason: 'Backup persistence', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Game Server', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'Leaderboard API', reason: 'LB distributes to API servers' },
      { from: 'Leaderboard API', to: 'Redis', reason: 'Fast sorted set operations' },
      { from: 'Leaderboard API', to: 'Database', reason: 'Backup persistence' },
    ],
    successCriteria: ['Add Load Balancer', 'Client → LB → API → Redis + Database'],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Load Balancer between Game Servers and API to distribute traffic',
    level2: 'Insert Load Balancer component and connect: Client → LB → App Server → Cache + Database',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Crash Recovery - Redis Persistence
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your Redis server crashes. All 100 million player ranks are GONE. Pure chaos.",
  hook: "Redis is in-memory. When it crashes, all data vanishes. Players log in to find their ranks reset to 0. Twitter is exploding. Your boss is calling!",
  challenge: "Configure Redis persistence (AOF + RDB) so you can recover from crashes!",
  illustration: 'crash-recovery',
};

const step6Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Data survives crashes now!",
  achievement: "Redis persistence configured for disaster recovery",
  metrics: [
    { label: 'Data Loss', before: '100% on crash', after: '< 1 second' },
    { label: 'Recovery Time', before: 'Manual rebuild', after: 'Automatic' },
  ],
  nextTeaser: "But reads are now slower than writes. How do you scale reads?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Redis Persistence: Surviving Crashes',
  conceptExplanation: `Redis is in-memory for speed. But RAM is volatile - crashes = data loss.

**Two Persistence Mechanisms:**

**1. RDB (Redis Database Snapshots)**
- Periodic snapshots of entire dataset
- Save to disk every N seconds: \`SAVE 900 1\` (save if ≥1 change in 900 sec)
- Fast recovery: Load entire snapshot into RAM
- ❌ Lose data between snapshots (up to 5-15 minutes)

**2. AOF (Append-Only File)**
- Log every write operation to disk
- Replay log on restart to rebuild state
- Modes:
  - \`appendfsync always\`: Sync every write (slow, no data loss)
  - \`appendfsync everysec\`: Sync every second (fast, ≤1 sec loss)
  - \`appendfsync no\`: Let OS decide (fastest, up to 30 sec loss)
- ✅ Minimal data loss (≤1 second with everysec)

**Best Practice: RDB + AOF Together**
- RDB for fast recovery (load snapshot)
- AOF to recover writes since last snapshot
- Configure: \`appendfsync everysec\` for balance

**Recovery Process:**
\`\`\`
Redis crashes at 3:00 AM
  ↓
Load last RDB snapshot (from 2:00 AM)
  ↓
Replay AOF log (2:00 AM - 2:59:59 AM)
  ↓
Back online with ≤1 second data loss!
\`\`\``,

  whyItMatters: 'In-memory speed is worthless if crashes lose all your data. Persistence is the safety net.',

  realWorldExample: {
    company: 'Discord',
    scenario: 'Uses Redis for presence ("User is online") and rate limiting',
    howTheyDoIt: 'AOF with appendfsync everysec. If Redis crashes, they lose ≤1 second of presence updates - acceptable. RDB snapshots every 5 minutes for faster recovery.',
  },

  famousIncident: {
    title: 'StackOverflow Redis Data Loss',
    company: 'Stack Overflow',
    year: '2012',
    whatHappened: 'Stack Overflow used Redis for real-time notifications and job queues. They had AOF disabled to maximize performance. A server crash lost 2 hours of queued jobs - thousands of notification emails were never sent.',
    lessonLearned: 'Always enable persistence for critical data! AOF with everysec has minimal performance impact but prevents catastrophic data loss. Pure in-memory is dangerous.',
    icon: '📧',
  },

  keyPoints: [
    'RDB: Fast snapshots, but lose data between snapshots',
    'AOF: Log all writes, minimal data loss (≤1 sec with everysec)',
    'Best practice: RDB + AOF together',
    'appendfsync everysec: Sweet spot (fast + safe)',
    'Recovery: Load RDB snapshot, replay AOF log',
  ],

  diagram: `
Redis Persistence (RDB + AOF):

┌────────────────────────────────────┐
│          Redis (In-Memory)         │
│      Sorted Set: 100M players      │
└───────────┬────────────────────────┘
            │
       Every write
            ↓
┌──────────────────────┐  ┌──────────────────┐
│    AOF Log (Disk)    │  │  RDB Snapshot    │
│ ZINCRBY alice +100   │  │  Every 5 min     │
│ ZADD bob 2000        │  │  Full dataset    │
│ ZINCRBY charlie +50  │  │  Binary format   │
└──────────────────────┘  └──────────────────┘

Crash Recovery:
1. Load last RDB snapshot (fast)
2. Replay AOF log since snapshot
3. Back online with ≤1 sec data loss
`,

  keyConcepts: [
    { title: 'RDB', explanation: 'Periodic snapshots - fast recovery, some data loss', icon: '📸' },
    { title: 'AOF', explanation: 'Write log - minimal data loss, slower recovery', icon: '📝' },
    { title: 'appendfsync', explanation: 'Sync frequency: always/everysec/no', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'What is the recommended Redis persistence strategy?',
    options: [
      'RDB only (snapshots are enough)',
      'AOF only (logs are enough)',
      'RDB + AOF together for best safety and performance',
      'No persistence (Redis is just a cache)',
    ],
    correctIndex: 2,
    explanation: 'RDB + AOF together gives you fast recovery (RDB) with minimal data loss (AOF). RDB alone loses data between snapshots. AOF alone has slow recovery. Together they complement each other!',
  },
};

const step6: GuidedStep = {
  id: 'leaderboard-step-6',
  stepNumber: 6,
  frIndex: 5,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'NFR-R1: Survive Redis crashes with minimal data loss',
    taskDescription: 'Configure Redis with AOF + RDB persistence (no architecture changes)',
    successCriteria: [
      'Enable Redis AOF (appendfsync everysec)',
      'Enable RDB snapshots (every 5 minutes)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'No architecture changes needed - configure Redis persistence settings',
    level2: 'Architecture is already correct - this step teaches persistence configuration',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Read Scaling - Redis Read Replicas
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📖',
  scenario: "You're getting 200K leaderboard reads per second, but only 50K writes. Reads are 4x higher!",
  hook: "Your Redis master is maxing out on CPU handling read queries. Writes are queuing up because reads are hogging the thread!",
  challenge: "Add Redis read replicas to offload read traffic from the master!",
  illustration: 'read-replicas',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Read scaling achieved!",
  achievement: "Redis read replicas handling 200K+ reads/sec",
  metrics: [
    { label: 'Read Capacity', before: '80K reads/sec', after: '200K+ reads/sec' },
    { label: 'Master CPU', before: '95%', after: '30%' },
  ],
  nextTeaser: "But what about players in Asia? They're seeing 300ms latency from US servers!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Redis Read Replicas: Scaling Reads',
  conceptExplanation: `Redis is single-threaded. One instance handles ~80K ops/sec. You're getting 200K reads!

**The Problem:**
- Reads and writes share the same thread
- High read load delays writes
- Single master can't handle 200K reads

**The Solution: Read Replicas**
- Master handles all writes
- Replicas replicate data from master (async)
- Replicas handle read queries (ZREVRANGE, ZREVRANK)
- Scale reads by adding more replicas

**Architecture:**
\`\`\`
Writes (50K/s)         Reads (200K/s)
      ↓                      ↓
   Master  ─────────▶   Replica 1 (100K reads)
      │                      │
      └────────────▶   Replica 2 (100K reads)
\`\`\`

**Replication Flow:**
1. Client sends ZINCRBY to master
2. Master updates sorted set
3. Master sends update to replicas (async)
4. Replicas apply update (eventually consistent)
5. Client reads from replicas

**Important: Eventual Consistency**
- Replicas lag behind master by ~10-100ms
- Player might see stale rank briefly after score update
- Acceptable for leaderboards (rankings change constantly anyway)`,

  whyItMatters: 'Read replicas let you scale reads independently of writes. Essential for read-heavy workloads like leaderboards.',

  realWorldExample: {
    company: 'Candy Crush',
    scenario: 'Millions of players checking leaderboards constantly',
    howTheyDoIt: '1 Redis master per region + 5 read replicas. Master handles score updates, replicas handle leaderboard queries. Scales to millions of reads/sec.',
  },

  famousIncident: {
    title: 'Pokémon GO Gym Leaderboard Lag',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'Pokémon GO initially had a single Redis instance per region for gym leaderboards. During peak hours, read queries overwhelmed the instance. Leaderboards became unresponsive, showing 5-10 second stale data.',
    lessonLearned: 'Separate read and write load with replicas. One master for writes, multiple replicas for reads. This is standard practice for read-heavy caching.',
    icon: '⚡',
  },

  keyPoints: [
    'Master handles all writes (ZADD, ZINCRBY)',
    'Replicas handle reads (ZREVRANGE, ZREVRANK)',
    'Replication is asynchronous (eventual consistency)',
    'Scale reads by adding more replicas',
    'Typical lag: 10-100ms (acceptable for leaderboards)',
  ],

  diagram: `
┌──────────────────────────────────────┐
│        Load Balancer                 │
└────────┬─────────────────────────────┘
         │
    ┌────┴────┐
  Writes   Reads
    ↓         ↓
┌─────────┐  ┌──────────────────┐
│ Redis   │  │  Read Replicas   │
│ Master  │  │                  │
│ (Writes)│─▶│ Replica 1 (100K) │
│ 50K/s   │  │ Replica 2 (100K) │
└─────────┘  └──────────────────┘
    │
    ↓
┌─────────┐
│Database │
└─────────┘

Master → Replicas: Async replication (10-100ms lag)
`,

  keyConcepts: [
    { title: 'Master-Replica', explanation: 'Master writes, replicas read - classic pattern', icon: '👑' },
    { title: 'Async Replication', explanation: 'Replicas lag behind master slightly', icon: '⏱️' },
    { title: 'Eventual Consistency', explanation: 'Replicas eventually match master', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why is eventual consistency acceptable for leaderboards?',
    options: [
      'Leaderboards don\'t need to be accurate',
      'Redis replication is always instant',
      'Rankings change frequently anyway, brief lag is imperceptible',
      'Players don\'t care about their rank',
    ],
    correctIndex: 2,
    explanation: 'Leaderboards are constantly changing as players complete matches. A 10-100ms lag is imperceptible when ranks change every second. Players won\'t notice if they\'re briefly shown as #1,247 instead of #1,246.',
  },
};

const step7: GuidedStep = {
  id: 'leaderboard-step-7',
  stepNumber: 7,
  frIndex: 6,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'NFR-S2: Handle 200K leaderboard reads per second',
    taskDescription: 'Add Redis read replicas to scale read queries (configure Redis replication)',
    successCriteria: [
      'Configure Redis with master-replica replication',
      'Route writes to master, reads to replicas',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Configure Redis replication: 1 master for writes, multiple replicas for reads',
    level2: 'No architecture changes needed - configure Cache component with replication',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 8: Global Distribution - Regional Clusters
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🌍',
  scenario: "Your game is global! Players in Tokyo, London, and São Paulo are all competing.",
  hook: "Asian players complain: 'Why is the leaderboard so slow?' They're seeing 300ms latency - the Redis cluster is in US-East!",
  challenge: "Deploy regional Redis clusters so players query local servers!",
  illustration: 'global-distribution',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Global leaderboard at scale!",
  achievement: "Sub-50ms latency for players worldwide",
  metrics: [
    { label: 'Asia Latency', before: '300ms', after: '20ms' },
    { label: 'Europe Latency', before: '200ms', after: '15ms' },
    { label: 'Global Coverage', after: '99.9%' },
  ],
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Regional Clusters: Global Low Latency',
  conceptExplanation: `Network latency is physics - you can't beat the speed of light.

**The Problem:**
- US-East to Tokyo: ~150ms round-trip
- Query takes 5ms in Redis, but 150ms in network!
- Players in Asia see slow leaderboards

**The Solution: Regional Redis Clusters**
- Deploy Redis cluster in each region:
  - US-East for North America
  - EU-West for Europe
  - AP-Southeast for Asia
- Players query their local cluster
- Latency: 10-20ms instead of 150-300ms

**Architecture:**
\`\`\`
Global Leaderboard:
┌────────────┐   ┌────────────┐   ┌────────────┐
│  US-East   │   │  EU-West   │   │  AP-SE     │
│  Redis     │   │  Redis     │   │  Redis     │
│  Cluster   │   │  Cluster   │   │  Cluster   │
└────────────┘   └────────────┘   └────────────┘
      ↑                ↑                ↑
   US Players    EU Players      Asian Players

Regional Leaderboards:
- Each region maintains its own sorted set
- OR sync global leaderboard across regions (async)
\`\`\`

**Design Choices:**
1. **Separate Regional Leaderboards**: Each region independent
   - Pros: Simple, fast, no sync needed
   - Cons: No global leaderboard
2. **Replicated Global Leaderboard**: Sync across regions
   - Pros: True global rankings
   - Cons: Complex sync, eventual consistency

For global leaderboards, use async replication between regions.`,

  whyItMatters: 'Network latency dominates for global applications. Regional deployment is essential for good UX.',

  realWorldExample: {
    company: 'League of Legends',
    scenario: 'Separate leaderboards per region (NA, EUW, KR, etc.)',
    howTheyDoIt: 'Each region has its own Redis cluster with millions of players. No global leaderboard - each region is independent. Simplifies architecture and ensures low latency.',
  },

  famousIncident: {
    title: 'Fortnite Asia-Pacific Launch Disaster',
    company: 'Epic Games',
    year: '2018',
    whatHappened: 'Fortnite initially ran all leaderboards from US servers. When they launched in Asia-Pacific, players saw 200-400ms leaderboard latencies. Combined with high player volume, Redis became overwhelmed. They had to disable leaderboards in APAC for 2 weeks while deploying regional clusters.',
    lessonLearned: 'Plan for regional deployment from the start. Network latency is the largest component of response time for global apps. Always deploy compute close to users.',
    icon: '🌏',
  },

  keyPoints: [
    'Network latency dominates query latency for global apps',
    'Deploy Redis clusters in each major region',
    'Players query local cluster for low latency',
    'Regional leaderboards: Simple, independent per region',
    'Global leaderboards: Complex, requires async replication',
  ],

  diagram: `
Global Deployment:

┌──────────────────────────────────────────────────┐
│              Global Load Balancer                │
│         (Routes by geo-location)                 │
└────────────┬─────────────────┬───────────────────┘
             │                 │
    ┌────────┴────────┐   ┌────┴──────────┐
    │   US Region     │   │  Asia Region  │
    │  ┌───────────┐  │   │  ┌──────────┐ │
    │  │ Redis     │  │   │  │ Redis    │ │
    │  │ Sorted    │  │   │  │ Sorted   │ │
    │  │ Sets      │  │   │  │ Sets     │ │
    │  └───────────┘  │   │  └──────────┘ │
    └─────────────────┘   └────────────────┘

US players → US cluster (20ms latency)
Asia players → Asia cluster (20ms latency)
`,

  keyConcepts: [
    { title: 'Geo-Routing', explanation: 'Route players to nearest region automatically', icon: '🌍' },
    { title: 'Regional Isolation', explanation: 'Each region independent - simple!', icon: '🔒' },
    { title: 'Cross-Region Sync', explanation: 'Optional: Async replication for global view', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why deploy regional Redis clusters instead of one global cluster?',
    options: [
      'Redis doesn\'t support global clusters',
      'Network latency is the bottleneck for global users',
      'Regional clusters are cheaper',
      'Redis is faster in certain regions',
    ],
    correctIndex: 1,
    explanation: 'Network latency (speed of light) dominates query time. A 5ms Redis query from Asia to US-East takes 150ms due to network round-trip. Regional clusters reduce this to 20ms.',
  },
};

const step8: GuidedStep = {
  id: 'leaderboard-step-8',
  stepNumber: 8,
  frIndex: 7,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'NFR-L1: Sub-50ms latency for players worldwide',
    taskDescription: 'Deploy regional Redis clusters for global low latency',
    successCriteria: [
      'Deploy Redis clusters in multiple regions',
      'Route players to nearest region',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'No architecture changes needed - deploy existing architecture in multiple regions',
    level2: 'Architecture is already correct - this step teaches regional deployment strategy',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const gamingLeaderboardCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'gaming-leaderboard-cache-guided',
  problemTitle: 'Build a Gaming Leaderboard - Redis Sorted Sets Mastery',

  requirementsPhase: gamingLeaderboardRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Leaderboard Queries',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Players can view top-100 leaderboard',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0, maxP99Latency: 50 },
    },
    {
      name: 'Personal Rank Queries',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Players can query their exact rank',
      traffic: { type: 'read', rps: 200, readRps: 200 },
      duration: 30,
      passCriteria: { maxErrorRate: 0, maxP99Latency: 50 },
    },
    {
      name: 'Score Updates',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Game servers can update player scores atomically',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0, maxP99Latency: 100 },
    },
    {
      name: 'NFR-S1: High Write Throughput',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 50,000 score updates per second',
      traffic: { type: 'write', rps: 50000, writeRps: 50000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 100 },
    },
    {
      name: 'NFR-S2: High Read Throughput',
      type: 'scalability',
      requirement: 'NFR-S2',
      description: 'Handle 200,000 leaderboard reads per second',
      traffic: { type: 'read', rps: 200000, readRps: 200000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 50 },
    },
    {
      name: 'NFR-R1: Redis Crash Recovery',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Recover from Redis crash with minimal data loss',
      traffic: { type: 'mixed', rps: 10000, readRps: 8000, writeRps: 2000 },
      duration: 90,
      failureInjection: { type: 'cache_crash', atSecond: 45, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 15 },
    },
    {
      name: 'NFR-L1: Global Low Latency',
      type: 'performance',
      requirement: 'NFR-L1',
      description: 'Sub-50ms latency for players worldwide',
      traffic: { type: 'mixed', rps: 50000, readRps: 40000, writeRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
  ] as TestCase[],

  concepts: [
    'Redis Sorted Sets (ZADD, ZINCRBY, ZRANGE, ZREVRANGE, ZREVRANK)',
    'Real-time ranking algorithms',
    'Atomic score updates',
    'Top-N leaderboard queries',
    'Cache-aside pattern',
    'Redis persistence (AOF + RDB)',
    'Read replicas for scaling',
    'Regional deployment for global latency',
  ],

  difficulty: 'intermediate',
  estimatedMinutes: 60,
};

export function getGamingLeaderboardCacheGuidedTutorial(): GuidedTutorial {
  return gamingLeaderboardCacheGuidedTutorial;
}
