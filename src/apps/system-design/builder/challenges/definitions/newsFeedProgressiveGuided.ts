import { GuidedTutorial } from '../../types/guidedTutorial';

export const newsFeedProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'news-feed-progressive',
  title: 'Design News Feed System',
  description: 'Build a social news feed from simple timeline to ML-ranked personalized content',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design fanout strategies for content distribution',
    'Build efficient feed retrieval and pagination',
    'Implement real-time feed updates',
    'Add ML-based ranking and personalization',
    'Handle viral content and celebrity users'
  ],
  prerequisites: ['Database design', 'Caching', 'Distributed systems'],
  tags: ['social-network', 'feed', 'fanout', 'ranking', 'real-time'],

  progressiveStory: {
    title: 'News Feed Evolution',
    premise: "You're building a news feed for a social platform. Starting with a simple chronological timeline, you'll evolve to handle billions of users with personalized, ranked content.",
    phases: [
      { phase: 1, title: 'Simple Timeline', description: 'Chronological feed from connections' },
      { phase: 2, title: 'Scalable Feed', description: 'Handle high fanout with caching' },
      { phase: 3, title: 'Real-Time Updates', description: 'Live feed updates and notifications' },
      { phase: 4, title: 'Smart Feed', description: 'ML ranking and content moderation' }
    ]
  },

  steps: [
    // PHASE 1: Simple Timeline (Steps 1-3)
    {
      id: 'step-1',
      title: 'Pull Model Feed',
      phase: 1,
      phaseTitle: 'Simple Timeline',
      learningObjective: 'Build feed by querying posts from connections',
      thinkingFramework: {
        framework: 'Pull on Read',
        approach: 'When user requests feed, query posts from all people they follow, merge, sort by time. Simple but expensive for users with many connections.',
        keyInsight: 'Pull is simple to implement but O(connections) per feed request. Works for small scale, not for Twitter-scale follow counts.'
      },
      requirements: {
        functional: [
          'Query posts from followed users',
          'Merge and sort by timestamp',
          'Return paginated feed',
          'Handle users with no posts'
        ],
        nonFunctional: [
          'Feed generation < 500ms for 100 connections'
        ]
      },
      hints: [
        'SELECT * FROM posts WHERE author_id IN (followed_ids) ORDER BY created_at DESC LIMIT 20',
        'Index on (author_id, created_at)',
        'Problem: IN clause with 1000s of IDs is slow'
      ],
      expectedComponents: ['Feed Service', 'Post Store', 'Follow Graph'],
      successCriteria: ['Feed shows posts from connections', 'Sorted by recency'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Push Model (Fanout on Write)',
      phase: 1,
      phaseTitle: 'Simple Timeline',
      learningObjective: 'Pre-compute feeds by pushing posts to followers',
      thinkingFramework: {
        framework: 'Push on Write',
        approach: 'When user posts, immediately add to all followers feed caches. Feed read is O(1) cache lookup. Write is O(followers).',
        keyInsight: 'Fanout on write: celebrity with 10M followers = 10M writes per post. Write amplification is the tradeoff for fast reads.'
      },
      requirements: {
        functional: [
          'On post create, fanout to followers',
          'Maintain per-user feed cache',
          'Remove posts on delete',
          'Handle unfollow (remove from feed)'
        ],
        nonFunctional: [
          'Feed read < 50ms'
        ]
      },
      hints: [
        'Feed cache: sorted set per user (post_id, timestamp)',
        'Async fanout via message queue',
        'Limit feed size (keep last 1000 posts)'
      ],
      expectedComponents: ['Fanout Service', 'Feed Cache', 'Message Queue'],
      successCriteria: ['Feed reads are fast', 'Posts appear in follower feeds'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Hybrid Fanout Strategy',
      phase: 1,
      phaseTitle: 'Simple Timeline',
      learningObjective: 'Combine push and pull for efficiency',
      thinkingFramework: {
        framework: 'Best of Both',
        approach: 'Push for normal users, pull for celebrities. Celebrity posts (10M+ followers) dont fanout; instead, merge on read.',
        keyInsight: 'Threshold: if user has >10K followers, their posts are pulled at read time, not pushed. Reduces write amplification significantly.'
      },
      requirements: {
        functional: [
          'Fanout for users under follower threshold',
          'Pull celebrity posts at read time',
          'Merge pushed and pulled posts',
          'Dynamic threshold based on follower count'
        ],
        nonFunctional: [
          'Celebrity post visible within 5 seconds'
        ]
      },
      hints: [
        'is_celebrity = follower_count > 10000',
        'On read: get cached feed + query celebrity posts',
        'Merge and dedup by post_id'
      ],
      expectedComponents: ['Hybrid Fanout', 'Celebrity Detector', 'Feed Merger'],
      successCriteria: ['Normal users get fast fanout', 'Celebrity posts dont overwhelm system'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Scalable Feed (Steps 4-6)
    {
      id: 'step-4',
      title: 'Feed Cache Design',
      phase: 2,
      phaseTitle: 'Scalable Feed',
      learningObjective: 'Design efficient feed storage and retrieval',
      thinkingFramework: {
        framework: 'Cache Structure',
        approach: 'Redis sorted set: user_id → sorted set of (post_id, score=timestamp). Fast range queries, efficient memory, supports pagination.',
        keyInsight: 'Store only post IDs in feed, not full posts. Hydrate posts from post cache on read. Reduces feed size 10x.'
      },
      requirements: {
        functional: [
          'Store feed as sorted set of post IDs',
          'Support efficient pagination (cursor-based)',
          'Hydrate posts from separate cache',
          'Handle missing posts gracefully'
        ],
        nonFunctional: [
          'Feed storage: < 10KB per user',
          'Feed read: < 50ms'
        ]
      },
      hints: [
        'ZREVRANGE user:feed:{id} 0 19 for top 20',
        'Cursor: last post timestamp for next page',
        'MGET for batch post hydration'
      ],
      expectedComponents: ['Feed Cache (Redis)', 'Post Cache', 'Hydration Service'],
      successCriteria: ['Feed reads fast', 'Pagination works correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Fanout Worker Scaling',
      phase: 2,
      phaseTitle: 'Scalable Feed',
      learningObjective: 'Scale fanout processing for high post volume',
      thinkingFramework: {
        framework: 'Async Processing',
        approach: 'Fanout cant block post creation. Queue post events, workers process. Partition by author for ordering, scale workers horizontally.',
        keyInsight: 'Partition queue by author_id mod N. Same author posts go to same partition. Maintains ordering per author.'
      },
      requirements: {
        functional: [
          'Queue fanout tasks asynchronously',
          'Partition work for parallelism',
          'Maintain post ordering per author',
          'Handle worker failures (retry)'
        ],
        nonFunctional: [
          'Fanout lag < 5 seconds for 99%',
          'Handle 100K posts/second'
        ]
      },
      hints: [
        'Kafka partition key = author_id',
        'Worker pool: scale based on queue depth',
        'Retry with backoff on Redis failures'
      ],
      expectedComponents: ['Fanout Queue (Kafka)', 'Fanout Workers', 'Retry Handler'],
      successCriteria: ['Fanout scales horizontally', 'Ordering preserved'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Feed Pagination & Deduplication',
      phase: 2,
      phaseTitle: 'Scalable Feed',
      learningObjective: 'Handle pagination edge cases and duplicates',
      thinkingFramework: {
        framework: 'Stable Pagination',
        approach: 'Offset pagination breaks with inserts. Cursor pagination: "give me posts after this timestamp". Stable even when new posts added.',
        keyInsight: 'Cursor = (timestamp, post_id) for uniqueness. Posts with same timestamp ordered by ID. Avoids skips and dupes.'
      },
      requirements: {
        functional: [
          'Cursor-based pagination (not offset)',
          'Handle posts with same timestamp',
          'Deduplicate when merging sources',
          'Support "newer than" and "older than" queries'
        ],
        nonFunctional: [
          'No skipped posts during pagination'
        ]
      },
      hints: [
        'Cursor: base64({timestamp, post_id})',
        'Query: WHERE (timestamp, id) < (cursor_ts, cursor_id)',
        'Dedup: seen set during merge'
      ],
      expectedComponents: ['Pagination Handler', 'Cursor Encoder', 'Deduplicator'],
      successCriteria: ['Pagination is stable', 'No duplicates in feed'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Real-Time Updates (Steps 7-9)
    {
      id: 'step-7',
      title: 'Live Feed Updates',
      phase: 3,
      phaseTitle: 'Real-Time Updates',
      learningObjective: 'Push new posts to connected clients',
      thinkingFramework: {
        framework: 'Push vs Poll',
        approach: 'Poll: client requests every 30s. Push: server sends on new post. WebSocket or Server-Sent Events for push. Push is more real-time, more complex.',
        keyInsight: 'Hybrid: WebSocket for active users (app open), poll for background. Reduces connection overhead while staying real-time.'
      },
      requirements: {
        functional: [
          'Push new posts to online followers',
          'Maintain WebSocket connections per user',
          'Handle reconnection gracefully',
          'Fall back to polling for disconnected clients'
        ],
        nonFunctional: [
          'New post visible in < 2 seconds',
          'Support 1M concurrent connections'
        ]
      },
      hints: [
        'WebSocket per user connection',
        'Pub/sub: user subscribes to their feed channel',
        'Connection state in Redis for horizontal scaling'
      ],
      expectedComponents: ['WebSocket Server', 'Presence Service', 'Push Notifier'],
      successCriteria: ['Live updates work', 'Reconnection handled'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Activity Notifications',
      phase: 3,
      phaseTitle: 'Real-Time Updates',
      learningObjective: 'Notify users of engagement on their content',
      thinkingFramework: {
        framework: 'Notification Types',
        approach: 'Likes, comments, shares on your posts. Aggregate to avoid spam (John and 5 others liked...). Different urgency levels.',
        keyInsight: 'Batch notifications: dont send immediately. Wait 5 minutes, aggregate similar notifications. Reduces notification fatigue.'
      },
      requirements: {
        functional: [
          'Generate notifications for likes/comments/shares',
          'Aggregate similar notifications',
          'Support notification preferences',
          'Mark as read/unread'
        ],
        nonFunctional: [
          'Notification within 5 minutes of activity'
        ]
      },
      hints: [
        'Notification: {type, actor, target, created_at}',
        'Aggregate: group by (type, target, time_window)',
        'Preference: user settings for each notification type'
      ],
      expectedComponents: ['Notification Generator', 'Aggregator', 'Delivery Service'],
      successCriteria: ['Notifications generated correctly', 'Aggregation reduces spam'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Viral Content Handling',
      phase: 3,
      phaseTitle: 'Real-Time Updates',
      learningObjective: 'Handle posts that go viral',
      thinkingFramework: {
        framework: 'Hot Content Detection',
        approach: 'Viral post: engagement rate >> normal. Detect early (first hour), cache aggressively, throttle fanout to prevent overload.',
        keyInsight: 'Viral detection: if likes/minute > 10x average, its going viral. Pre-warm caches, rate limit fanout, switch to pull.'
      },
      requirements: {
        functional: [
          'Detect viral content by engagement velocity',
          'Cache viral posts aggressively',
          'Throttle fanout for viral posts',
          'Switch viral posts to pull model'
        ],
        nonFunctional: [
          'Viral post doesnt degrade system',
          'Detection within 5 minutes'
        ]
      },
      hints: [
        'Velocity = delta(engagement) / delta(time)',
        'Viral threshold: velocity > 10x median',
        'Hot cache: dedicated cache tier for viral'
      ],
      expectedComponents: ['Viral Detector', 'Hot Cache', 'Throttle Manager'],
      successCriteria: ['Viral posts detected early', 'System stays stable'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Smart Feed (Steps 10-12)
    {
      id: 'step-10',
      title: 'ML-Based Feed Ranking',
      phase: 4,
      phaseTitle: 'Smart Feed',
      learningObjective: 'Rank feed by predicted engagement',
      thinkingFramework: {
        framework: 'Beyond Chronological',
        approach: 'Chronological misses best content. Rank by predicted engagement: P(like), P(comment), P(share). Train on historical interactions.',
        keyInsight: 'Features: post content, author engagement history, viewer-author affinity, time decay. Model predicts engagement probability.'
      },
      requirements: {
        functional: [
          'Score each post for ranking',
          'Consider user preferences in ranking',
          'Apply time decay for freshness',
          'A/B test ranking models'
        ],
        nonFunctional: [
          'Ranking adds < 50ms latency'
        ]
      },
      hints: [
        'Features: post_age, author_follower_count, user_author_interactions, content_type',
        'Model: gradient boosted trees or neural net',
        'Time decay: score * 0.95^hours_old'
      ],
      expectedComponents: ['Ranking Model', 'Feature Store', 'A/B Framework'],
      successCriteria: ['Engagement increases with ranking', 'Freshness maintained'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Content Diversity & Serendipity',
      phase: 4,
      phaseTitle: 'Smart Feed',
      learningObjective: 'Balance relevance with content variety',
      thinkingFramework: {
        framework: 'Filter Bubble Prevention',
        approach: 'Pure relevance ranking creates filter bubbles. Inject diversity: different topics, different authors, some exploration.',
        keyInsight: 'MMR (Maximal Marginal Relevance): re-rank to maximize relevance AND diversity. Penalize posts similar to already-selected ones.'
      },
      requirements: {
        functional: [
          'Ensure topic diversity in feed',
          'Limit posts from same author',
          'Inject exploration posts (new topics)',
          'Balance known preferences with discovery'
        ],
        nonFunctional: [
          'No more than 3 consecutive posts from same author'
        ]
      },
      hints: [
        'Topic clustering for diversity',
        'Author throttling: max 20% of feed from one author',
        'Exploration: 10% of feed from outside normal interests'
      ],
      expectedComponents: ['Diversity Ranker', 'Topic Classifier', 'Exploration Injector'],
      successCriteria: ['Feed is diverse', 'Users discover new content'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Content Moderation',
      phase: 4,
      phaseTitle: 'Smart Feed',
      learningObjective: 'Filter harmful content from feeds',
      thinkingFramework: {
        framework: 'Multi-Layer Moderation',
        approach: 'Layer 1: automated ML classifiers (spam, hate, nudity). Layer 2: user reports. Layer 3: human review. Balance safety vs free expression.',
        keyInsight: 'Precision vs recall tradeoff. High recall = block more bad content but also block good. Err toward safety but provide appeals.'
      },
      requirements: {
        functional: [
          'ML classifiers for spam, hate speech, nudity',
          'User reporting workflow',
          'Human review queue for edge cases',
          'Appeals process for false positives'
        ],
        nonFunctional: [
          'Block 99% of policy-violating content',
          'False positive rate < 1%'
        ]
      },
      hints: [
        'Multi-label classifier: spam, hate, violence, nudity',
        'Confidence thresholds: high confidence = auto-remove, medium = human review',
        'Shadow ban: dont notify violator, just reduce distribution'
      ],
      expectedComponents: ['Content Classifier', 'Report Queue', 'Review Dashboard', 'Appeals Handler'],
      successCriteria: ['Harmful content removed', 'False positives appealable'],
      estimatedTime: '8 minutes'
    }
  ]
};
