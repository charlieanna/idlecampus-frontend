import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * Twitter Coach Configuration
 * Pattern: Social Feed + Fanout + Caching
 * Focus: Timeline generation, fanout strategies, read-heavy caching
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Basic Tweet & Timeline',
  goal: 'Build a system where users can post tweets and view their timeline',
  description: 'Learn the fundamentals of social media architecture',
  estimatedTime: '15 minutes',
  learningObjectives: [
    'Understand tweet storage and retrieval',
    'Design a basic timeline query',
    'Handle follow relationships',
    'Connect components for social media',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to Twitter! This is a classic social media problem. You\'ll learn how to design a system where users post tweets and see a personalized timeline from people they follow.',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: Build a basic Twitter feed\n\nUsers should be able to:\n• Post tweets (280 characters)\n• Follow/unfollow other users\n• View timeline (tweets from followed users)\n• Like and retweet posts\n\nStart simple: Client → App Server → Database',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ Great! App Server added. This will handle:\n• POST /tweet - Create new tweets\n• GET /timeline - Fetch user\'s timeline\n• POST /follow - Follow a user\n• POST /like - Like a tweet\n\nNow add a database!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: '✅ PostgreSQL added! Good for storing:\n• Users table\n• Tweets table (id, user_id, text, created_at)\n• Follows table (follower_id, following_id)\n• Likes table (tweet_id, user_id)\n\n💡 Joins will be needed for timeline queries!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Components need connections!\n\nBasic flow:\n1. Client → App Server (tweet requests)\n2. App Server → Database (store/query tweets)\n\nConnect them with arrows!',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Awesome! Your basic Twitter works!\n\nUsers can post tweets and view timelines. But there\'s a problem: generating timelines is SLOW with database joins. Let\'s optimize!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Twitter needs to store tweets, users, and follow relationships. A relational database (PostgreSQL/MySQL) is perfect for this.',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Add:\n1. App Server (API endpoints for posting/reading)\n2. PostgreSQL (stores users, tweets, follows, likes)\n\nConnect: Client → App Server → PostgreSQL',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 180 },
      hint: '🎯 Direct help: The minimum setup is:\n• App Server (business logic)\n• PostgreSQL (data storage)\n\nConnect Client → App Server → PostgreSQL',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Timeline Fanout Strategy',
  goal: 'Optimize timeline generation using fanout-on-write strategy',
  description: 'Learn the famous "fanout problem" and how Twitter/Instagram solve it',
  estimatedTime: '25 minutes',
  learningObjectives: [
    'Understand fanout-on-write vs fanout-on-read',
    'Implement pre-computed timelines',
    'Use Redis for timeline caching',
    'Handle celebrity users (millions of followers)',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2 Goal: Optimize timeline generation!\n\n⚠️ The Problem:\nGenerating a timeline by querying all followed users is SLOW:\n\nSELECT * FROM tweets\nWHERE user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)\nORDER BY created_at DESC\n\nThis requires a JOIN across millions of rows! 😱',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: '⚠️ Database bottleneck!\n\nTimeline queries are killing PostgreSQL. With 1M users each following 200 people, every timeline request does a massive JOIN.\n\n💡 Solution: Pre-compute timelines using fanout-on-write!',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis added! Perfect for storing pre-computed timelines.\n\n💡 Fanout-on-write strategy:\n1. When user A posts a tweet:\n2. Fan out to all followers\' timelines\n3. Add tweet to each follower\'s Redis list\n4. Reading timeline = O(1) from Redis!\n\nExample:\nUser A posts → Push to 500 followers\' timelines in Redis',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'message_queue' },
      message: '✅ Message Queue added! Great for async fanout processing.\n\n💡 How it works:\n1. User posts tweet → Write to DB\n2. Publish message to queue\n3. Workers consume message\n4. Workers fan out to Redis timelines\n\nThis makes posting instant (async fanout)!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Fanout Strategy' },
      message: '⚠️ Fanout not implemented!\n\nYou need:\n1. Redis (store pre-computed timelines)\n2. Message Queue (async fanout workers)\n3. Workers (fan out tweets to followers)\n\nArchitecture:\nPost Tweet → Queue → Workers → Redis Timelines',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Excellent! Timeline generation is now lightning fast!\n\nYou\'ve implemented fanout-on-write! But there\'s still a challenge: celebrity users with millions of followers. Let\'s tackle that!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Instead of computing timelines on-read (slow joins), pre-compute them on-write. Where can you store these pre-computed timelines for fast access?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint: Use fanout-on-write:\n1. Add Redis to store pre-computed timelines\n2. Add Message Queue for async fanout\n3. When user posts, fan out tweet to all followers\' Redis timelines\n\nReading timeline = O(1) from Redis!',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 300 },
      hint: '🎯 Direct solution:\n1. Add Redis (stores timeline:{user_id} as sorted sets)\n2. Add Message Queue (Kafka/RabbitMQ)\n3. Add Workers (consume queue, fan out to Redis)\n\nFlow: Post → DB + Queue → Workers → Redis timelines',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Hybrid Fanout for Celebrities',
  goal: 'Handle celebrity users with millions of followers efficiently',
  description: 'Combine fanout-on-write and fanout-on-read for optimal performance',
  estimatedTime: '30 minutes',
  learningObjectives: [
    'Understand celebrity problem (1M+ followers)',
    'Implement hybrid fanout strategy',
    'Use cache for celebrity tweets',
    'Scale to 100M users with mixed approach',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3 Goal: Handle celebrity users!\n\n⚠️ The Problem:\nIf @taylorswift (300M followers) posts a tweet, fanout-on-write would:\n1. Write to 300M Redis timelines\n2. Take 10+ minutes\n3. Crush the system 💥\n\n💡 Solution: Hybrid fanout!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis cache for celebrity tweets!\n\n💡 Hybrid strategy:\n• Regular users (<10K followers): fanout-on-write\n• Celebrities (>10K followers): fanout-on-read\n\nWhen loading timeline:\n1. Fetch from pre-computed Redis timeline (regular users)\n2. Merge with celebrity tweets from cache (on-read)\n3. Sort by timestamp\n\nBest of both worlds!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'message_queue' },
      message: '⚠️ Message Queue bottleneck!\n\nWith celebrity tweets, the queue is overwhelmed trying to fan out to millions of followers.\n\n💡 Solution: Don\'t fan out celebrities! Cache their recent tweets instead and merge on-read.',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'cdn' },
      message: '✅ CDN added! Perfect for caching:\n• User profiles\n• Profile images\n• Popular tweets\n• Trending topics\n\nReduces origin server load by 90%!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Amazing! You\'ve built Twitter at scale!\n\nYou\'ve mastered:\n✓ Fanout-on-write for regular users\n✓ Fanout-on-read for celebrities\n✓ Hybrid strategy for optimal performance\n✓ Caching at every layer\n\nYou can now handle 100M+ users! 🚀',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_problem',
        problemId: 'instagram',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Celebrities break fanout-on-write (too many followers). What if you DON\'T fan out celebrity tweets, but instead fetch them on-read and merge?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint: Implement hybrid fanout:\n1. If user has <10K followers: fanout-on-write (as before)\n2. If user has >10K followers: cache recent tweets in Redis\n3. On timeline read: merge pre-computed + celebrity tweets\n\nThis is how Twitter actually does it!',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 360 },
      hint: '🎯 Direct solution:\n1. Check follower count when posting\n2. If <10K: fanout-on-write (existing flow)\n3. If >10K: cache in Redis celebrity:{user_id}:tweets\n4. On timeline read: fetch pre-computed + fetch celebrity cache + merge\n5. Add CDN for static assets',
      hintLevel: 3,
    },
  ],
};

export const twitterCoachConfig: ProblemCoachConfig = {
  problemId: 'twitter',
  archetype: 'social_feed',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '🎉 Level 1 Complete!\n\nYou\'ve built a basic Twitter! You understand:\n• Tweet storage and retrieval\n• Follow relationships\n• Basic timeline queries\n\nNext: Optimize timeline generation with fanout!',
    2: '🎉 Level 2 Complete!\n\nYou\'ve mastered the fanout problem! You\'ve learned:\n• Fanout-on-write strategy\n• Pre-computed timelines in Redis\n• Async processing with message queues\n• O(1) timeline reads!\n\nNext: Handle celebrity users!',
    3: '🎉 Twitter Complete! 🐦\n\nYou\'ve mastered social feeds at scale! Key achievements:\n• Basic CRUD for tweets and follows\n• Fanout-on-write for regular users\n• Fanout-on-read for celebrities\n• Hybrid strategy for 100M+ users\n• Timeline generation in milliseconds\n\nThis is real-world architecture! 🚀',
  },
  nextProblemRecommendation: 'instagram',
  prerequisites: ['trello'],
  estimatedTotalTime: '70 minutes',
};

export function getTwitterLevelConfig(level: number): LevelCoachConfig | null {
  return twitterCoachConfig.levelConfigs[level] || null;
}
