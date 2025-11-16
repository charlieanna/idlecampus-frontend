import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  highAvailabilityValidator,
  costOptimizationValidator,
} from '../../validation/validators/commonValidators';
import {
  cacheStrategyConsistencyValidator,
  cacheInvalidationValidator,
} from '../../validation/validators/cachingValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Twitter - Microblogging Platform
 * Comprehensive FR and NFR scenarios with DDIA/SDP concepts
 *
 * DDIA Concepts Applied (CANONICAL EXAMPLE from DDIA Chapter 1):
 * - Chapter 1 (Intro): Fan-out problem - Timeline generation strategies
 *   - Fan-out on write: Pre-compute timelines when tweet is posted (write-heavy)
 *   - Fan-out on read: Compute timeline when user requests it (read-heavy)
 *   - Hybrid: Fan-out on write for most users, fan-out on read for celebrities
 * - Chapter 5 (Replication): Read replicas for scaling timeline reads
 * - Chapter 6 (Partitioning): Partition tweets by user_id or tweet_id for horizontal scaling
 * - Chapter 7 (Transactions): Ensure consistency for like/retweet counts
 * - Chapter 9 (Consistency): Eventual consistency acceptable for timelines
 *
 * System Design Primer Concepts:
 * - Caching: Redis for timeline caching (pre-computed timelines)
 * - Load Balancing: Distribute read/write traffic across app servers
 * - Message Queue: Async processing for fan-out on write
 * - Search: Elasticsearch for tweet/user search
 */
export const twitterProblemDefinition: ProblemDefinition = {
  id: 'twitter',
  title: 'Twitter - Microblogging Platform',
  description: `Design a microblogging platform like Twitter that:
- Users can post short messages (tweets) up to 280 characters
- Users can follow other users and see their tweets in a timeline
- Users can like and retweet posts
- Users can search for tweets and users

Learning Objectives (DDIA/SDP):
1. Solve the fan-out problem for timeline generation (DDIA Ch. 1)
   - Fan-out on write: Pre-compute timelines (faster reads, slower writes)
   - Fan-out on read: Compute on demand (faster writes, slower reads)
   - Hybrid approach: Different strategies for different user scales
2. Scale read-heavy timeline requests with read replicas (DDIA Ch. 5)
3. Partition tweets by user_id for horizontal scaling (DDIA Ch. 6)
4. Use caching for pre-computed timelines (SDP - Caching)
5. Handle eventual consistency in timelines (DDIA Ch. 9)
6. Async processing with message queues for fan-out (SDP - Message Queue)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can post short messages (tweets) up to 280 characters',
    'Users can follow or unfollow other users',
    'Users can view personalized timelines from followed accounts',
    'Users can like or retweet posts',
    'Users can search for tweets and users'
  ],

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'Timeline latency: p99 < 200ms (DDIA Ch. 1: Fan-out on write + caching)',
    'Tweet post latency: p99 < 500ms (DDIA Ch. 1: Async fan-out with message queue)',
    'Replication lag: < 1s average (DDIA Ch. 5: Async replication)',
    'Cache hit ratio: > 90% for timeline requests (SDP: Cache pre-computed timelines)',
    'Availability: 99.9% uptime (DDIA Ch. 5: Multi-replica setup)',
    'Consistency: Eventual consistency for timelines acceptable (DDIA Ch. 9)',
    'Fan-out write: < 5s to update all followers (DDIA Ch. 1: Async message queue)',
    'Scalability: Support 100M users, 500M tweets/day (DDIA Ch. 6: Partition by user_id)',
    'Search latency: p99 < 300ms (SDP: Elasticsearch for full-text search)',
  ],

  // Single locked client for compact canvas
  clientDescriptions: [
    {
      name: 'Twitter Client',
      subtitle: 'Posts, follows, reads timelines, engages, searches',
      id: 'twitter_client'
    }
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests (post, read timeline)',
      },
      {
        type: 'storage',
        reason: 'Need to store tweets, users, follows, likes',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write tweet data',
      },
    ],
    dataModel: {
      entities: ['user', 'tweet', 'follow', 'like'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        tweet: ['id', 'user_id', 'text', 'created_at'],
        follow: ['follower_id', 'following_id', 'created_at'],
        like: ['tweet_id', 'user_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Posting tweets
        { type: 'read_by_query', frequency: 'very_high' }, // Reading timeline
      ],
    },
  },

  scenarios: generateScenarios('twitter', problemConfigs.twitter),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
    },
    {
      name: 'High Availability (DDIA Ch. 5)',
      validate: highAvailabilityValidator,
    },
    {
      name: 'Cache Strategy Consistency (SDP - Caching)',
      validate: cacheStrategyConsistencyValidator,
    },
    {
      name: 'Cache Invalidation (SDP - Caching)',
      validate: cacheInvalidationValidator,
    },
    {
      name: 'Cost Optimization (DDIA - Trade-offs)',
      validate: costOptimizationValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
tweets = {}
follows = {}
likes = {}

def post_tweet(tweet_id: str, user_id: str, text: str) -> Dict:
    """
    FR-1: Users can post short messages (tweets) up to 280 characters
    Naive implementation - stores tweet in memory
    No validation for character limit
    """
    tweets[tweet_id] = {
        'id': tweet_id,
        'user_id': user_id,
        'text': text[:280],  # Truncate to 280 chars
        'created_at': datetime.now()
    }
    return tweets[tweet_id]

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    FR-2: Users can follow other users
    Naive implementation - stores follow relationship in memory
    """
    follow_key = f"{follower_id}_{following_id}"
    follows[follow_key] = {
        'follower_id': follower_id,
        'following_id': following_id,
        'created_at': datetime.now()
    }
    return follows[follow_key]

def get_timeline(user_id: str, limit: int = 50) -> List[Dict]:
    """
    FR-2: Users can see tweets from users they follow in a timeline
    Naive implementation - returns all tweets from followed users
    No ranking algorithm
    """
    # Get all users this user follows
    following = []
    for follow in follows.values():
        if follow['follower_id'] == user_id:
            following.append(follow['following_id'])

    # Get all tweets from followed users
    timeline = []
    for tweet in tweets.values():
        if tweet['user_id'] in following:
            timeline.append(tweet)

    # Sort by created_at (most recent first)
    timeline.sort(key=lambda x: x['created_at'], reverse=True)
    return timeline[:limit]

def like_tweet(tweet_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can like posts
    Naive implementation - stores like in memory
    """
    like_id = f"{tweet_id}_{user_id}"
    likes[like_id] = {
        'tweet_id': tweet_id,
        'user_id': user_id,
        'created_at': datetime.now()
    }
    return likes[like_id]

def retweet(retweet_id: str, original_tweet_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can retweet posts
    Naive implementation - creates new tweet referencing original
    """
    original = tweets.get(original_tweet_id)
    if not original:
        return None

    tweets[retweet_id] = {
        'id': retweet_id,
        'user_id': user_id,
        'text': original['text'],
        'original_tweet_id': original_tweet_id,
        'is_retweet': True,
        'created_at': datetime.now()
    }
    return tweets[retweet_id]

def search_tweets(query: str) -> List[Dict]:
    """
    FR-4: Users can search for tweets
    Naive implementation - simple substring match
    """
    results = []
    for tweet in tweets.values():
        if query.lower() in tweet['text'].lower():
            results.append(tweet)
    return results

def search_users(query: str) -> List[Dict]:
    """
    FR-4: Users can search for users
    Naive implementation - simple substring match on username
    """
    results = []
    for user in users.values():
        if query.lower() in user.get('username', '').lower():
            results.append(user)
    return results
`,
};
