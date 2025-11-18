/**
 * Twitter Feed Challenge - Tier 2 (Moderate)
 *
 * Students configure pre-built algorithms
 * Focus on choosing the right algorithm for requirements
 */

import { TieredChallenge, AlgorithmOption, ConfigurableAlgorithm } from '../../types/challengeTiers';

/**
 * Feed ranking algorithm options
 */
const FEED_RANKING_OPTIONS: AlgorithmOption[] = [
  {
    id: 'chronological',
    name: 'Chronological (Time-based)',
    description: 'Show tweets in reverse chronological order (newest first)',
    performanceProfile: {
      avgLatency: 20,
      throughputMultiplier: 1.0,
      cpuIntensive: false,
      memoryIntensive: false,
      ioIntensive: true,
    },
    configCode: `
# Simple time-based sorting
tweets = db.get_user_timeline(user_id)
return sorted(tweets, key=lambda t: t.timestamp, reverse=True)
    `,
  },
  {
    id: 'engagement',
    name: 'Engagement-based',
    description: 'Sort by likes + retweets + replies (popular tweets first)',
    performanceProfile: {
      avgLatency: 50,
      throughputMultiplier: 0.8,
      cpuIntensive: true,
      memoryIntensive: false,
      ioIntensive: true,
    },
    configCode: `
# Calculate engagement score
tweets = db.get_user_timeline(user_id)
for tweet in tweets:
    tweet.score = tweet.likes + tweet.retweets * 2 + tweet.replies * 3
return sorted(tweets, key=lambda t: t.score, reverse=True)
    `,
  },
  {
    id: 'ml_personalized',
    name: 'ML Personalized (AI-powered)',
    description: 'Machine learning model predicts relevance for each user',
    performanceProfile: {
      avgLatency: 200,
      throughputMultiplier: 0.3,
      cpuIntensive: true,
      memoryIntensive: true,
      ioIntensive: true,
    },
    configCode: `
# ML-based ranking
tweets = db.get_user_timeline(user_id)
user_features = ml.extract_user_features(user_id)
for tweet in tweets:
    tweet.relevance = ml_model.predict(user_features, tweet.features)
return sorted(tweets, key=lambda t: t.relevance, reverse=True)
    `,
  },
  {
    id: 'hybrid',
    name: 'Hybrid (Time + Engagement)',
    description: 'Combines recency with popularity (best of both)',
    performanceProfile: {
      avgLatency: 80,
      throughputMultiplier: 0.6,
      cpuIntensive: true,
      memoryIntensive: true,
      ioIntensive: true,
    },
    configCode: `
# Hybrid scoring: recency decay + engagement
tweets = db.get_user_timeline(user_id)
now = time.now()
for tweet in tweets:
    age_hours = (now - tweet.timestamp) / 3600
    recency_score = 1 / (1 + age_hours / 24)  # Decay over days
    engagement_score = (tweet.likes + tweet.retweets * 2) / 1000
    tweet.score = recency_score * 0.4 + engagement_score * 0.6
return sorted(tweets, key=lambda t: t.score, reverse=True)
    `,
  },
];

/**
 * Cache strategy options
 */
const CACHE_STRATEGY_OPTIONS: AlgorithmOption[] = [
  {
    id: 'user_timeline',
    name: 'Pre-computed Timeline Cache',
    description: 'Cache entire rendered timeline per user (fastest reads)',
    performanceProfile: {
      avgLatency: 5,
      throughputMultiplier: 2.0,
      cpuIntensive: false,
      memoryIntensive: true, // Stores full timeline per user
      ioIntensive: false,
    },
  },
  {
    id: 'tweet_cache',
    name: 'Individual Tweet Cache',
    description: 'Cache tweets separately, compute timeline on-demand',
    performanceProfile: {
      avgLatency: 30,
      throughputMultiplier: 1.0,
      cpuIntensive: true, // Compute timeline each time
      memoryIntensive: false,
      ioIntensive: false,
    },
  },
  {
    id: 'hybrid_cache',
    name: 'Hybrid Cache (Hot users + tweets)',
    description: 'Pre-compute for popular users, tweet cache for others',
    performanceProfile: {
      avgLatency: 15,
      throughputMultiplier: 1.5,
      cpuIntensive: false,
      memoryIntensive: true,
      ioIntensive: false,
    },
  },
  {
    id: 'no_cache',
    name: 'No Caching (Direct DB)',
    description: 'Always fetch from database (simple but slow)',
    performanceProfile: {
      avgLatency: 100,
      throughputMultiplier: 0.3,
      cpuIntensive: false,
      memoryIntensive: false,
      ioIntensive: true,
    },
  },
];

/**
 * Write propagation strategy options
 */
const WRITE_STRATEGY_OPTIONS: AlgorithmOption[] = [
  {
    id: 'push',
    name: 'Push Model (Write-heavy)',
    description: 'When tweet posted, immediately update all follower timelines',
    performanceProfile: {
      avgLatency: 500, // Slow writes
      throughputMultiplier: 0.2,
      cpuIntensive: true,
      memoryIntensive: true,
      ioIntensive: true,
    },
  },
  {
    id: 'pull',
    name: 'Pull Model (Read-heavy)',
    description: 'Compute timeline on-demand when user requests',
    performanceProfile: {
      avgLatency: 200, // Slow reads
      throughputMultiplier: 0.5,
      cpuIntensive: true,
      memoryIntensive: false,
      ioIntensive: true,
    },
  },
  {
    id: 'hybrid_push_pull',
    name: 'Hybrid Push/Pull',
    description: 'Push to active users, pull for inactive users',
    performanceProfile: {
      avgLatency: 100,
      throughputMultiplier: 1.0,
      cpuIntensive: true,
      memoryIntensive: true,
      ioIntensive: true,
    },
  },
];

/**
 * Twitter Feed Tier 2 Challenge
 */
export const twitterFeedTieredChallenge: TieredChallenge = {
  id: 'twitter_feed_tiered',
  title: 'Twitter Feed (Tier 2)',
  difficulty: 'intermediate',
  implementationTier: 'moderate',

  description: `Design Twitter's home timeline feed system.

**Your Task:**
1. Design the system architecture
2. Configure the feed algorithm (no coding required!)
3. Choose caching and write strategies
4. Balance performance vs cost vs user experience

The system must handle:
- Millions of users viewing their feeds
- Celebrity users with millions of followers
- Real-time updates when new tweets arrive`,

  requirements: {
    functional: [
      'Display personalized feed for each user',
      'Show tweets from followed users',
      'Support different ranking algorithms',
      'Handle celebrity users (1M+ followers)',
    ],
    traffic: '10,000 RPS feed reads, 1,000 RPS tweet posts',
    latency: 'p99 < 200ms for feed generation',
    availability: '99.95% uptime',
    budget: '$5,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'worker',
    'database',
    'cache',
    'message_queue',
    'cdn',
    's3',
  ],

  // Tier 2: Students configure these algorithms
  configurableAlgorithms: [
    {
      componentType: 'app_server',
      algorithmKey: 'feed_ranking',
      label: 'Feed Ranking Algorithm',
      description: 'How to sort tweets in the timeline',
      options: FEED_RANKING_OPTIONS,
      defaultOption: 'chronological',
    },
    {
      componentType: 'app_server',
      algorithmKey: 'cache_strategy',
      label: 'Caching Strategy',
      description: 'How to cache timeline data',
      options: CACHE_STRATEGY_OPTIONS,
      defaultOption: 'tweet_cache',
    },
    {
      componentType: 'app_server',
      algorithmKey: 'write_strategy',
      label: 'Write Propagation',
      description: 'How to handle new tweets',
      options: WRITE_STRATEGY_OPTIONS,
      defaultOption: 'pull',
    },
  ],

  // Component behaviors based on configuration
  componentBehaviors: {
    appServer: {
      operations: {
        read: {
          baseLatency: 50, // Will be modified by algorithm choice
          cpuIntensive: true,
          memoryIntensive: true,
          ioIntensive: true,
        },
        create: {
          baseLatency: 100,
          cpuIntensive: true,
          memoryIntensive: false,
          ioIntensive: true,
        },
      },
    },
    worker: {
      behavior: 'transform_and_write',
      transformations: ['aggregate_metrics', 'generate_timeline'],
    },
    database: {
      dataModel: 'wide-column',
      schema: {
        tables: [
          {
            name: 'tweets',
            fields: [
              { name: 'tweet_id', type: 'uuid', indexed: true },
              { name: 'user_id', type: 'uuid', indexed: true },
              { name: 'content', type: 'text' },
              { name: 'timestamp', type: 'timestamp', indexed: true },
              { name: 'likes', type: 'counter' },
              { name: 'retweets', type: 'counter' },
            ],
            primaryKey: 'tweet_id',
          },
          {
            name: 'timelines',
            fields: [
              { name: 'user_id', type: 'uuid', indexed: true },
              { name: 'tweet_ids', type: 'list<uuid>' },
              { name: 'last_updated', type: 'timestamp' },
            ],
            primaryKey: 'user_id',
          },
        ],
        estimatedSize: '100B tweets, 500TB',
      },
    },
  },

  testCases: [
    {
      name: 'Normal User Feed',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Regular user (100 follows) viewing feed',
      traffic: {
        type: 'read',
        rps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.01,
      },
    },
    {
      name: 'Celebrity Tweet',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Celebrity (5M followers) posts a tweet',
      traffic: {
        type: 'write',
        rps: 10, // 10 celebrities tweeting
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 5000, // Can be slow for celebrity writes
        maxErrorRate: 0.01,
      },
    },
    {
      name: 'Trending Event',
      type: 'scalability',
      requirement: 'NFR-S2',
      description: 'Major event causes 10x traffic spike',
      traffic: {
        type: 'mixed',
        rps: 50000,
        readRps: 45000,
        writeRps: 5000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.05,
        minAvailability: 0.99,
      },
    },
  ],

  learningObjectives: [
    'Understand feed generation strategies (push vs pull)',
    'Learn tradeoffs between different ranking algorithms',
    'Design for celebrity user problem (fanout)',
    'Optimize caching strategies for social networks',
    'Balance real-time vs eventual consistency',
  ],

  hints: [
    {
      trigger: 'algorithm_selected:ml_personalized',
      message: `⚠️ ML Personalized is powerful but expensive!

Pros:
- Best user engagement
- Highly relevant content

Cons:
- 200ms latency (10x slower than cached)
- High CPU/memory usage
- Requires ML infrastructure

Consider hybrid approach for cost optimization.`,
    },
    {
      trigger: 'test_failed:Celebrity Tweet',
      message: `💡 Celebrity fanout is overwhelming your system!

With push model + 5M followers:
- 5M timeline updates per tweet!
- Database write explosion

Solutions:
1. Use hybrid push/pull
2. Push only to active users
3. Use message queue for async processing`,
    },
    {
      trigger: 'high_cost',
      message: `💰 Your configuration is expensive!

Cost factors:
- ML ranking: +$2000/month for GPU
- Timeline cache: +$1000/month for memory
- Push model: +$1500/month for writes

Try chronological + tweet cache for budget option.`,
    },
  ],

  // UI configuration
  showCodeEditor: false,
  showAlgorithmConfig: true,
};