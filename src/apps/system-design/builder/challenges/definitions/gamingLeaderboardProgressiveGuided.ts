import { GuidedTutorial } from '../../types/guidedTutorial';

export const gamingLeaderboardProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'gaming-leaderboard-progressive',
  title: 'Design a Gaming Leaderboard',
  description: 'Build a leaderboard system from simple rankings to real-time global competitions',
  difficulty: 'medium',
  estimatedTime: '60 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design efficient ranking with sorted sets',
    'Handle real-time score updates at scale',
    'Implement multiple leaderboard types (global, friends, time-based)',
    'Build tournament and season systems',
    'Add anti-cheat and score verification'
  ],
  prerequisites: ['Redis basics', 'Database design', 'Real-time systems'],
  tags: ['gaming', 'leaderboard', 'ranking', 'real-time', 'redis'],

  progressiveStory: {
    title: 'Gaming Leaderboard Evolution',
    premise: "You're building a leaderboard for a mobile game. Starting with simple rankings, you'll evolve to handle millions of players with real-time updates, seasonal competitions, and anti-cheat protection.",
    phases: [
      { phase: 1, title: 'Basic Rankings', description: 'Score submission and rankings' },
      { phase: 2, title: 'Multiple Leaderboards', description: 'Global, friends, and time-based' },
      { phase: 3, title: 'Competitions', description: 'Tournaments and seasons' },
      { phase: 4, title: 'Scale & Integrity', description: 'High traffic and anti-cheat' }
    ]
  },

  steps: [
    // PHASE 1: Basic Rankings (Steps 1-3)
    {
      id: 'step-1',
      title: 'Score Submission',
      phase: 1,
      phaseTitle: 'Basic Rankings',
      learningObjective: 'Accept and store player scores',
      thinkingFramework: {
        framework: 'Write-Heavy Design',
        approach: 'Scores submitted constantly during gameplay. Store raw scores with metadata. Update leaderboard position in real-time or batched.',
        keyInsight: 'Keep best score vs latest score vs cumulative. Most games use best score for rankings but track all for analytics.'
      },
      requirements: {
        functional: [
          'Submit score with player ID and game context',
          'Store score with timestamp and metadata',
          'Track personal best score per player',
          'Validate score within expected range'
        ],
        nonFunctional: [
          'Score submission < 100ms'
        ]
      },
      hints: [
        'Score: {player_id, score, game_id, timestamp, metadata}',
        'Personal best: UPDATE IF score > current_best',
        'Validation: reject impossible scores (0, MAX_INT)'
      ],
      expectedComponents: ['Score Service', 'Score Store', 'Validator'],
      successCriteria: ['Scores stored correctly', 'Personal best tracked'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Ranking with Sorted Sets',
      phase: 1,
      phaseTitle: 'Basic Rankings',
      learningObjective: 'Use Redis sorted sets for efficient ranking',
      thinkingFramework: {
        framework: 'O(log N) Operations',
        approach: 'Redis ZSET: sorted by score, O(log N) insert/update, O(log N) rank query. Perfect for leaderboards. Handles millions of entries.',
        keyInsight: 'ZRANK gives position (0-indexed). ZREVRANK for descending order. ZRANGE for top N. All O(log N) or O(log N + M).'
      },
      requirements: {
        functional: [
          'Add/update player score in sorted set',
          'Get player rank (position)',
          'Get top N players',
          'Get players around a specific rank'
        ],
        nonFunctional: [
          'Rank query < 10ms'
        ]
      },
      hints: [
        'ZADD leaderboard score player_id (adds or updates)',
        'ZREVRANK leaderboard player_id (rank, descending)',
        'ZREVRANGE leaderboard 0 99 WITHSCORES (top 100)'
      ],
      expectedComponents: ['Leaderboard (Redis ZSET)', 'Rank Service', 'Top N Query'],
      successCriteria: ['Rankings calculated correctly', 'Fast queries'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Tie-Breaking',
      phase: 1,
      phaseTitle: 'Basic Rankings',
      learningObjective: 'Handle players with same score',
      thinkingFramework: {
        framework: 'Composite Scoring',
        approach: 'Same score = tie. Break by: time achieved (first wins), secondary metric (fewer moves), or share rank. Redis doesnt support secondary sort.',
        keyInsight: 'Encode tiebreaker in score: score * 1_000_000 + (MAX_TIME - time). Higher time = lower composite score. Maintains single sort key.'
      },
      requirements: {
        functional: [
          'Break ties by timestamp (earlier wins)',
          'Support secondary score for tiebreaking',
          'Display tied players at same rank',
          'Handle score update without losing tiebreaker'
        ],
        nonFunctional: []
      },
      hints: [
        'Composite: score * 10^9 + (MAX_EPOCH - timestamp)',
        'Decode: actual_score = floor(composite / 10^9)',
        'Or: dense ranking where ties share rank'
      ],
      expectedComponents: ['Score Encoder', 'Tie Handler', 'Rank Display'],
      successCriteria: ['Ties broken consistently', 'Display correct'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Multiple Leaderboards (Steps 4-6)
    {
      id: 'step-4',
      title: 'Friends Leaderboard',
      phase: 2,
      phaseTitle: 'Multiple Leaderboards',
      learningObjective: 'Show rankings among friends',
      thinkingFramework: {
        framework: 'Filtered View',
        approach: 'Dont create separate leaderboard per friend group. Query global leaderboard, filter to friends, re-rank. More efficient.',
        keyInsight: 'Get friend IDs, ZSCORE each friend from global, sort in memory. O(F * log N) where F = friend count. Fast for typical friend counts.'
      },
      requirements: {
        functional: [
          'Get leaderboard for players friends',
          'Show rank among friends (not global rank)',
          'Include current player in friends list',
          'Handle players with no friends'
        ],
        nonFunctional: [
          'Friends leaderboard < 200ms for 500 friends'
        ]
      },
      hints: [
        'Get friend list from social service',
        'ZSCORE in pipeline for all friends',
        'Sort results, assign friend-relative rank'
      ],
      expectedComponents: ['Friends Service', 'Friend Leaderboard Query', 'Rank Calculator'],
      successCriteria: ['Friends ranked correctly', 'Fast for reasonable friend count'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Time-Based Leaderboards',
      phase: 2,
      phaseTitle: 'Multiple Leaderboards',
      learningObjective: 'Implement daily, weekly, and monthly rankings',
      thinkingFramework: {
        framework: 'Rolling Windows',
        approach: 'Separate leaderboard per time period. Daily resets at midnight UTC. Keep historical for comparison. Rotate keys.',
        keyInsight: 'Key pattern: leaderboard:daily:2024-01-15. Expire old keys automatically. Or use single key and rebuild on rotation.'
      },
      requirements: {
        functional: [
          'Create daily, weekly, monthly leaderboards',
          'Reset at period boundaries',
          'Show "your best ranking this week"',
          'Archive historical leaderboards'
        ],
        nonFunctional: [
          'Period rotation < 1 minute'
        ]
      },
      hints: [
        'Key: leaderboard:{period}:{date_key}',
        'Daily: date_key = YYYY-MM-DD',
        'Weekly: date_key = YYYY-WW (week number)'
      ],
      expectedComponents: ['Period Manager', 'Rotation Scheduler', 'Archive Service'],
      successCriteria: ['Periods rotate correctly', 'Historical accessible'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Regional & Segmented Leaderboards',
      phase: 2,
      phaseTitle: 'Multiple Leaderboards',
      learningObjective: 'Partition leaderboards by region or segment',
      thinkingFramework: {
        framework: 'Sharded Leaderboards',
        approach: 'Global is competitive but discouraging for average players. Regional gives more chances to rank high. Segment by country, level, etc.',
        keyInsight: 'Multiple overlapping leaderboards: player in global, regional, and level-bracket simultaneously. Update all on score submit.'
      },
      requirements: {
        functional: [
          'Create leaderboards per region/country',
          'Segment by player level or skill bracket',
          'Update multiple leaderboards atomically',
          'Let player see relevant leaderboards'
        ],
        nonFunctional: []
      },
      hints: [
        'Keys: leaderboard:global, leaderboard:region:US, leaderboard:level:10-20',
        'On score submit: update all applicable leaderboards',
        'Pipeline for atomic multi-update'
      ],
      expectedComponents: ['Segment Manager', 'Multi-Leaderboard Updater', 'Leaderboard Selector'],
      successCriteria: ['Multiple segments work', 'Updates consistent'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Competitions (Steps 7-9)
    {
      id: 'step-7',
      title: 'Tournament System',
      phase: 3,
      phaseTitle: 'Competitions',
      learningObjective: 'Run time-limited competitive events',
      thinkingFramework: {
        framework: 'Event Lifecycle',
        approach: 'Tournament: registration → active → ended → rewards. Separate leaderboard per tournament. Entry fee optional. Prizes for top ranks.',
        keyInsight: 'Tournament size affects competition feel. 100 players more achievable than 1M. Bucket into parallel tournaments of fixed size.'
      },
      requirements: {
        functional: [
          'Create tournament with start/end time',
          'Handle player registration/entry',
          'Maintain tournament-specific leaderboard',
          'Distribute rewards on tournament end'
        ],
        nonFunctional: [
          'Tournament supports 10K concurrent players'
        ]
      },
      hints: [
        'Tournament: {id, name, start_time, end_time, rules, prizes}',
        'Leaderboard key: tournament:{id}',
        'Rewards: top N get prizes, distributed on end'
      ],
      expectedComponents: ['Tournament Service', 'Registration Handler', 'Reward Distributor'],
      successCriteria: ['Tournaments run correctly', 'Rewards distributed'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Season & Battle Pass',
      phase: 3,
      phaseTitle: 'Competitions',
      learningObjective: 'Implement multi-week competitive seasons',
      thinkingFramework: {
        framework: 'Long-Running Progression',
        approach: 'Season: months-long competition period. Battle pass: progression track with rewards. Combines competitive ranking with engagement incentives.',
        keyInsight: 'Season rank different from battle pass level. Rank is competitive (top %). Level is progression (cumulative points).'
      },
      requirements: {
        functional: [
          'Define season with duration and rules',
          'Track seasonal ranking separately',
          'Implement battle pass progression tiers',
          'Reset rankings at season end, reward top players'
        ],
        nonFunctional: [
          'Season transition < 5 minutes downtime'
        ]
      },
      hints: [
        'Season: 3-month duration, top 10% get rewards',
        'Battle pass: 100 tiers, XP thresholds per tier',
        'Archive season leaderboard, create new for next'
      ],
      expectedComponents: ['Season Manager', 'Battle Pass Service', 'Season Archive'],
      successCriteria: ['Seasons transition smoothly', 'Progression tracked'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Matchmaking Ratings',
      phase: 3,
      phaseTitle: 'Competitions',
      learningObjective: 'Calculate skill-based ratings (ELO/MMR)',
      thinkingFramework: {
        framework: 'Skill Rating Systems',
        approach: 'ELO: expected win probability based on rating difference. Win against higher rated = gain more. Used for matchmaking AND leaderboard.',
        keyInsight: 'ELO is zero-sum: winner gains what loser loses. Good for 1v1. Team games use variations (TrueSkill, Glicko).'
      },
      requirements: {
        functional: [
          'Calculate rating change on match result',
          'Track confidence/uncertainty in rating',
          'Use rating for leaderboard ranking',
          'Handle placement matches for new players'
        ],
        nonFunctional: [
          'Rating update < 100ms post-match'
        ]
      },
      hints: [
        'ELO formula: K * (actual - expected)',
        'Expected = 1 / (1 + 10^((opponent - player)/400))',
        'Placement: higher K factor for first 10 games'
      ],
      expectedComponents: ['Rating Calculator', 'Match Processor', 'Placement Handler'],
      successCriteria: ['Ratings reflect skill', 'New players calibrate quickly'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale & Integrity (Steps 10-12)
    {
      id: 'step-10',
      title: 'High-Traffic Handling',
      phase: 4,
      phaseTitle: 'Scale & Integrity',
      learningObjective: 'Handle millions of concurrent score submissions',
      thinkingFramework: {
        framework: 'Write Batching',
        approach: 'Peak traffic during events. Buffer writes, batch to Redis. Accept eventual consistency for leaderboard (seconds delay).',
        keyInsight: 'Leaderboard doesnt need real-time accuracy. Batch writes every 1 second. 1M individual writes → 1000 batched writes.'
      },
      requirements: {
        functional: [
          'Buffer score submissions',
          'Batch writes to leaderboard',
          'Handle burst traffic gracefully',
          'Show "updating" indicator during batch delay'
        ],
        nonFunctional: [
          'Handle 100K score submissions/second',
          'Leaderboard delay < 5 seconds'
        ]
      },
      hints: [
        'Buffer in local memory or Redis list',
        'Worker: LPOP batch, ZADD pipeline',
        'Circuit breaker if Redis overloaded'
      ],
      expectedComponents: ['Score Buffer', 'Batch Writer', 'Traffic Controller'],
      successCriteria: ['Traffic spikes handled', 'No score loss'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Score Verification',
      phase: 4,
      phaseTitle: 'Scale & Integrity',
      learningObjective: 'Validate scores to prevent cheating',
      thinkingFramework: {
        framework: 'Defense in Depth',
        approach: 'Client-submitted scores are untrusted. Verify: replay validation, statistical analysis, device attestation. Multiple layers.',
        keyInsight: 'Perfect verification is impossible for client games. Make cheating hard and detectable. Ban waves more effective than real-time blocks.'
      },
      requirements: {
        functional: [
          'Validate score against game rules',
          'Detect statistically impossible scores',
          'Verify game replay matches claimed score',
          'Flag suspicious scores for review'
        ],
        nonFunctional: [
          'Detect 99% of obvious cheats'
        ]
      },
      hints: [
        'Rules: max score per level, max score/second',
        'Statistical: z-score > 3 from population mean',
        'Replay: deterministic game with seed verification'
      ],
      expectedComponents: ['Score Validator', 'Anomaly Detector', 'Replay Verifier', 'Flag Queue'],
      successCriteria: ['Cheated scores detected', 'Legitimate scores accepted'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Player Display & Profiles',
      phase: 4,
      phaseTitle: 'Scale & Integrity',
      learningObjective: 'Show rich player information on leaderboard',
      thinkingFramework: {
        framework: 'Efficient Hydration',
        approach: 'Leaderboard shows player names, avatars, countries. ZSET stores only IDs. Hydrate player data from cache.',
        keyInsight: 'Batch hydration: get top 100 IDs, MGET all player profiles. Dont N+1 query. Cache profiles aggressively.'
      },
      requirements: {
        functional: [
          'Display player name and avatar',
          'Show country flag',
          'Link to player profile',
          'Cache player display data'
        ],
        nonFunctional: [
          'Leaderboard page load < 500ms'
        ]
      },
      hints: [
        'Player cache: player:{id} → {name, avatar_url, country}',
        'Bulk fetch: MGET player:1 player:2 player:3...',
        'Cache TTL: 1 hour (profile changes rare)'
      ],
      expectedComponents: ['Player Service', 'Profile Cache', 'Display Formatter'],
      successCriteria: ['Rich display renders quickly', 'Profiles cached'],
      estimatedTime: '6 minutes'
    }
  ]
};
