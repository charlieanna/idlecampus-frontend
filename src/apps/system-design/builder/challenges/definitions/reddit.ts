import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Reddit - Discussion Forum Platform
 * DDIA Ch. 3 (Storage & Retrieval) - Secondary Indexes for Ranking
 *
 * DDIA Concepts Applied:
 * - Ch. 3: Secondary indexes for sorting by score
 *   - Index on (subreddit_id, score DESC, created_at DESC) for "Hot" feed
 *   - Index on (subreddit_id, created_at DESC) for "New" feed
 *   - Index on (subreddit_id, comment_count DESC) for "Top" feed
 * - Ch. 3: Covering indexes to avoid table lookups
 *   - Include (title, author_id, thumbnail) in index for feed queries
 * - Ch. 2: Adjacency list model for nested comments
 *   - parent_comment_id references parent in same table
 *   - Recursive queries to fetch comment trees
 *
 * Reddit's Ranking Algorithm (DDIA Ch. 3 - Custom Scoring):
 * - **Hot**: score = log10(upvotes - downvotes) + (created_at / 45000)
 *   - Balances vote count with recency
 *   - Older posts decay over time
 * - **Top**: Simple sort by score (upvotes - downvotes)
 * - **New**: Sort by created_at DESC
 *
 * Indexing Strategy (DDIA Ch. 3):
 * - Composite index: (subreddit_id, hot_score DESC) for hot feed
 * - Materialized view: Pre-compute hot_score on write
 * - Denormalize: Cache comment_count on posts table
 *
 * System Design Primer - Rate Limiting (Deep Dive):
 *
 * Reddit must prevent abuse (spam, scraping, DDoS) while allowing legitimate users.
 * We'll explore 4 major rate limiting algorithms and when to use each.
 *
 * Why Rate Limiting?
 * ==================
 * 1. Prevent API abuse (bots posting spam every second)
 * 2. Protect infrastructure (limit requests to prevent server overload)
 * 3. Fair resource allocation (ensure all users get fair access)
 * 4. Monetization (free tier gets 10 req/min, paid tier gets 1000 req/min)
 *
 *
 * 1. Token Bucket Algorithm (Most Common):
 * =========================================
 *
 * Concept: Bucket holds tokens, each request consumes 1 token, tokens refill at constant rate.
 *
 * Parameters:
 * - Bucket capacity: 10 tokens (max burst)
 * - Refill rate: 1 token per second
 *
 * Timeline Example:
 * - T=0s: Bucket has 10 tokens (full)
 * - User makes 5 requests → 5 tokens consumed → 5 tokens left
 * - T=1s: +1 token refilled → 6 tokens
 * - User makes 10 requests → 6 succeed, 4 rejected (429 Too Many Requests)
 * - T=5s: +5 tokens refilled → 5 tokens
 *
 * Implementation (Python):
 * class TokenBucket:
 *     def __init__(self, capacity, refill_rate):
 *         self.capacity = capacity
 *         self.tokens = capacity  # Start full
 *         self.refill_rate = refill_rate  # Tokens per second
 *         self.last_refill = time.time()
 *
 *     def allow_request(self):
 *         # Refill tokens based on elapsed time
 *         now = time.time()
 *         elapsed = now - self.last_refill
 *         new_tokens = elapsed * self.refill_rate
 *         self.tokens = min(self.capacity, self.tokens + new_tokens)
 *         self.last_refill = now
 *
 *         # Try to consume 1 token
 *         if self.tokens >= 1:
 *             self.tokens -= 1
 *             return True  # Allow request
 *         return False  # Rate limit exceeded
 *
 * # Usage: 10 requests per minute (10 capacity, 10/60 = 0.167 refill rate)
 * limiter = TokenBucket(capacity=10, refill_rate=10/60)
 * if limiter.allow_request():
 *     process_request()
 * else:
 *     return 429  # Too Many Requests
 *
 * Pros:
 * - Allows bursts (user can make 10 requests immediately if bucket is full)
 * - Smooth refilling (consistent long-term rate)
 * - Memory efficient (store only: tokens, last_refill per user)
 *
 * Cons:
 * - Allows large bursts (user can consume all 10 tokens at once)
 * - Doesn't enforce strict request spacing
 *
 * Best For: APIs where occasional bursts are acceptable
 * Reddit Use Case: Comment posting (allow users to post 10 comments quickly, then 1/sec)
 *
 *
 * 2. Leaky Bucket Algorithm:
 * ==========================
 *
 * Concept: Requests enter bucket, processed at constant rate (leak). Bucket overflows if too full.
 *
 * Parameters:
 * - Bucket capacity: 10 requests (queue size)
 * - Leak rate: 1 request per second (processing rate)
 *
 * Timeline Example:
 * - T=0s: Bucket is empty
 * - User makes 5 requests → Added to bucket (queue size: 5)
 * - T=1s: Process 1 request (leak) → Queue size: 4
 * - T=2s: Process 1 request → Queue size: 3
 * - User makes 10 more requests → Only 7 fit (bucket capacity 10) → 3 rejected
 *
 * Implementation (Simplified):
 * class LeakyBucket:
 *     def __init__(self, capacity, leak_rate):
 *         self.capacity = capacity
 *         self.queue = []
 *         self.leak_rate = leak_rate  # Requests per second
 *
 *     def add_request(self, request):
 *         # Remove leaked requests (simulate constant drain)
 *         self._leak()
 *
 *         # Try to add request to queue
 *         if len(self.queue) < self.capacity:
 *             self.queue.append(request)
 *             return True  # Request queued
 *         return False  # Bucket full, reject
 *
 *     def _leak(self):
 *         # Process requests at constant rate
 *         # (simplified: in reality, use background worker)
 *         pass
 *
 * Pros:
 * - Smooth output rate (requests processed at exact constant rate)
 * - No bursts (enforces strict rate)
 *
 * Cons:
 * - Queuing delay (requests must wait in queue)
 * - Memory overhead (must store entire queue)
 * - Doesn't allow legitimate bursts
 *
 * Best For: Systems requiring strict constant rate (video encoding, batch jobs)
 * Reddit Use Case: Vote processing (process votes at steady rate to prevent DB spikes)
 *
 *
 * 3. Fixed Window Counter:
 * ========================
 *
 * Concept: Count requests in fixed time windows (e.g., 1-minute buckets).
 *
 * Parameters:
 * - Window size: 1 minute
 * - Max requests per window: 10
 *
 * Timeline Example:
 * - T=0:00-0:59: Window 1
 *   - User makes 8 requests → Allowed (8/10)
 * - T=0:50: User makes 5 requests → 3 allowed, 2 rejected (10/10 limit hit)
 * - T=1:00-1:59: Window 2 (reset counter)
 *   - User makes 10 requests → All allowed (fresh window)
 *
 * Implementation (Redis):
 * import redis
 * r = redis.Redis()
 *
 * def allow_request(user_id):
 *     key = f"rate_limit:{user_id}:{current_minute()}"
 *     count = r.incr(key)
 *
 *     if count == 1:
 *         r.expire(key, 60)  # Set TTL for window expiration
 *
 *     return count <= 10  # Max 10 requests per minute
 *
 * def current_minute():
 *     return int(time.time() / 60)  # Unix timestamp floored to minute
 *
 * Pros:
 * - Simple to implement (single Redis counter)
 * - Memory efficient (one key per user per window)
 * - Fast (Redis INCR is O(1))
 *
 * Cons:
 * - Boundary problem: User can make 10 requests at 0:59, then 10 more at 1:00 (20 in 1 second!)
 * - Doesn't smooth traffic (allows bursts at window boundaries)
 *
 * Best For: Simple rate limiting where exact accuracy isn't critical
 * Reddit Use Case: API key limits for external developers (100 requests per hour)
 *
 *
 * 4. Sliding Window Log:
 * ======================
 *
 * Concept: Store timestamp of each request, count requests in rolling window.
 *
 * Parameters:
 * - Window size: 1 minute
 * - Max requests: 10
 *
 * Timeline Example:
 * - T=0:30: User makes request → Log: [0:30]
 * - T=0:45: User makes 5 requests → Log: [0:30, 0:45, 0:45, 0:45, 0:45, 0:45]
 * - T=1:00: Check window [0:00-1:00] → 6 requests → Allow
 * - T=1:20: Check window [0:20-1:20] → Only count requests after 0:20 → 5 requests (0:30, 0:45 x5)
 *
 * Implementation (Redis):
 * import redis
 * import time
 *
 * r = redis.Redis()
 *
 * def allow_request(user_id):
 *     now = time.time()
 *     key = f"rate_limit:log:{user_id}"
 *
 *     # Remove timestamps older than 1 minute (sliding window)
 *     r.zremrangebyscore(key, 0, now - 60)
 *
 *     # Count requests in current window
 *     count = r.zcard(key)
 *
 *     if count < 10:
 *         # Add current request timestamp
 *         r.zadd(key, {now: now})
 *         r.expire(key, 60)  # Cleanup old keys
 *         return True
 *     return False
 *
 * Pros:
 * - No boundary problem (true sliding window)
 * - Accurate rate limiting (counts exact requests in rolling 60 seconds)
 *
 * Cons:
 * - Memory overhead (store every request timestamp)
 * - More complex (Redis sorted set operations)
 * - Slower than fixed window (O(log N) for zremrangebyscore)
 *
 * Best For: Critical APIs requiring exact rate limits
 * Reddit Use Case: Subreddit creation (max 1 per day per user, must be exact)
 *
 *
 * 5. Sliding Window Counter (Hybrid):
 * ===================================
 *
 * Concept: Estimate sliding window using two fixed windows (current + previous).
 *
 * Formula:
 * estimated_count = previous_window_count * (1 - elapsed_ratio) + current_window_count
 *
 * Example:
 * - Previous window (12:00-12:59): 8 requests
 * - Current window (13:00-13:59): 3 requests
 * - Current time: 13:30 (50% into current window)
 * - Elapsed ratio: 50% = 0.5
 * - Estimated sliding window count: 8 * (1 - 0.5) + 3 = 4 + 3 = 7 requests
 *
 * Implementation (Redis):
 * def allow_request(user_id):
 *     now = time.time()
 *     current_window = int(now / 60)
 *     previous_window = current_window - 1
 *
 *     current_key = f"rate_limit:{user_id}:{current_window}"
 *     previous_key = f"rate_limit:{user_id}:{previous_window}"
 *
 *     current_count = int(r.get(current_key) or 0)
 *     previous_count = int(r.get(previous_key) or 0)
 *
 *     # Calculate elapsed ratio in current window
 *     elapsed_ratio = (now % 60) / 60
 *
 *     # Estimate sliding window count
 *     estimated_count = previous_count * (1 - elapsed_ratio) + current_count
 *
 *     if estimated_count < 10:
 *         r.incr(current_key)
 *         r.expire(current_key, 120)  # Keep for 2 windows
 *         return True
 *     return False
 *
 * Pros:
 * - Mitigates boundary problem (smoother than fixed window)
 * - Memory efficient (only 2 counters per user)
 * - Fast (simple arithmetic)
 *
 * Cons:
 * - Approximate (not perfectly accurate)
 * - Can still allow slight bursts
 *
 * Best For: Balancing accuracy and performance
 * Reddit Use Case: Post submissions (max 10 per hour, but bursts ok)
 *
 *
 * Distributed Rate Limiting (Redis):
 * ===================================
 *
 * Challenge: Multiple API servers need shared rate limit state.
 *
 * Solution: Use Redis as centralized counter.
 *
 * Architecture:
 * User → Server1 → Redis (shared state)
 * User → Server2 → Redis (same state)
 *
 * Race Condition Problem:
 * - Server1 reads count=9
 * - Server2 reads count=9 (simultaneously)
 * - Both increment → count=11 (limit exceeded!)
 *
 * Solution: Use Redis Lua script (atomic operation)
 *
 * Lua Script (Atomic Token Bucket):
 * local key = KEYS[1]
 * local capacity = tonumber(ARGV[1])
 * local refill_rate = tonumber(ARGV[2])
 * local now = tonumber(ARGV[3])
 *
 * local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
 * local tokens = tonumber(bucket[1]) or capacity
 * local last_refill = tonumber(bucket[2]) or now
 *
 * -- Refill tokens
 * local elapsed = now - last_refill
 * local new_tokens = math.min(capacity, tokens + elapsed * refill_rate)
 *
 * -- Try to consume token
 * if new_tokens >= 1 then
 *     redis.call('HMSET', key, 'tokens', new_tokens - 1, 'last_refill', now)
 *     redis.call('EXPIRE', key, 3600)  -- Cleanup after 1 hour
 *     return 1  -- Allow
 * end
 *
 * return 0  -- Deny
 *
 * Usage:
 * allowed = redis.eval(lua_script, 1, f"bucket:{user_id}", 10, 0.167, time.time())
 *
 *
 * Rate Limiting Strategies:
 * =========================
 *
 * Per-User Rate Limiting:
 * - Key: user:{user_id}
 * - Use case: Prevent individual user abuse
 * - Example: Max 10 posts per hour per user
 *
 * Per-IP Rate Limiting:
 * - Key: ip:{ip_address}
 * - Use case: Prevent DDoS from single IP
 * - Example: Max 100 requests per minute per IP
 *
 * Per-API-Key Rate Limiting:
 * - Key: api_key:{api_key}
 * - Use case: Tiered API access (free vs paid)
 * - Example: Free tier = 100 req/hour, Paid tier = 10,000 req/hour
 *
 * Per-Endpoint Rate Limiting:
 * - Key: user:{user_id}:endpoint:{endpoint}
 * - Use case: Different limits for different operations
 * - Example: Posting = 10/hour, Voting = 1000/hour
 *
 *
 * Reddit-Specific Rate Limiting:
 * ==============================
 *
 * Post Submission:
 * - Algorithm: Token bucket (allow bursts, then slow down)
 * - Limit: 5 posts per hour (capacity: 5, refill: 5/3600 = 0.0014 per second)
 * - Prevents spam while allowing legitimate users to post multiple times
 *
 * Comment Posting:
 * - Algorithm: Leaky bucket (smooth rate)
 * - Limit: 10 comments per minute
 * - Prevents comment spam storms
 *
 * Voting:
 * - Algorithm: Fixed window counter (simple, high volume)
 * - Limit: 1000 votes per hour
 * - Performance > accuracy for high-volume operations
 *
 * Subreddit Creation:
 * - Algorithm: Sliding window log (strict accuracy)
 * - Limit: 1 per day per user
 * - Critical operation requiring exact enforcement
 *
 * API Access (External Developers):
 * - Algorithm: Sliding window counter (balance accuracy and performance)
 * - Limit: 100 requests per hour (free tier)
 * - Tiered limits based on API key
 *
 *
 * Response Headers (Best Practice):
 * ==================================
 *
 * Include rate limit info in HTTP headers:
 *
 * HTTP/1.1 200 OK
 * X-RateLimit-Limit: 10           # Max requests per window
 * X-RateLimit-Remaining: 7        # Remaining requests
 * X-RateLimit-Reset: 1699999999   # Unix timestamp when limit resets
 *
 * HTTP/1.1 429 Too Many Requests
 * Retry-After: 60                 # Seconds until retry allowed
 *
 *
 * System Design Primer - Other Concepts:
 * - Database Indexing: Use composite indexes for efficient sorting
 * - Caching: Cache top posts per subreddit in Redis (TTL: 5 minutes)
 */
export const redditProblemDefinition: ProblemDefinition = {
  id: 'reddit',
  title: 'Reddit - Discussion Forum',
  description: `Design a discussion forum like Reddit that:
- Users can create posts in different subreddits
- Users can comment on posts (nested comments)
- Users can upvote and downvote posts and comments
- Posts are ranked by votes and recency

Learning Objectives (DDIA Ch. 3 + SDP Rate Limiting):
1. Design secondary indexes for sorting/ranking (DDIA Ch. 3)
   - Composite index: (subreddit_id, score DESC, created_at DESC)
   - Covering index to avoid extra lookups
2. Implement custom ranking algorithms (DDIA Ch. 3)
   - Reddit's "Hot" algorithm: balance votes and time decay
3. Model nested comments with adjacency list (DDIA Ch. 2)
   - Recursive queries for comment trees
4. Optimize read-heavy workload with denormalization (DDIA Ch. 3)
   - Cache comment_count, score on posts table
5. Master all 5 rate limiting algorithms (SDP):
   - Token bucket: Allow bursts (comment posting)
   - Leaky bucket: Strict constant rate (vote processing)
   - Fixed window counter: Simple, fast (API keys)
   - Sliding window log: Exact accuracy (subreddit creation)
   - Sliding window counter: Hybrid approach (post submissions)
6. Implement distributed rate limiting with Redis (SDP):
   - Centralized state for multi-server setup
   - Atomic operations with Lua scripts
7. Design per-user, per-IP, per-API-key limits (SDP)
8. Understand rate limiting trade-offs (SDP):
   - Accuracy vs performance vs memory
   - Boundary problems in fixed windows
   - Burst allowance vs strict rate enforcement`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create posts in different subreddits',
    'Users can comment on posts (nested comments)',
    'Users can upvote and downvote posts and comments',
    'Posts are ranked by votes and recency'
  ],

  userFacingNFRs: [
    'Feed latency: p99 < 200ms for "Hot" feed (DDIA Ch. 3: Composite index)',
    'Sorting performance: Index scan, not table scan (DDIA Ch. 3: Secondary index)',
    'Comment tree query: < 100ms for 500 comments (DDIA Ch. 2: Adjacency list)',
    'Vote update: < 50ms with denormalized score (DDIA Ch. 3)',
    'Partitioning: Partition by subreddit for data locality (DDIA Ch. 6)',
    'Post submission: 5 per hour with token bucket (SDP: Allow bursts)',
    'Comment posting: 10 per minute with leaky bucket (SDP: Smooth rate)',
    'Voting: 1000 per hour with fixed window (SDP: Performance over accuracy)',
    'Subreddit creation: 1 per day with sliding window log (SDP: Exact enforcement)',
    'API access: 100 req/hour free tier (SDP: Tiered limits)',
    'Rate limit check latency: < 5ms with Redis (SDP: Distributed limiting)',
    'Rate limit accuracy: 99.9% with Lua scripts (SDP: Atomic operations)',
    'Burst handling: 10x normal rate for 10 seconds (SDP: Token bucket capacity)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (post, comment, vote)',
      },
      {
        type: 'storage',
        reason: 'Need to store posts, comments, votes, users',
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
        reason: 'App server needs to read/write content',
      },
    ],
    dataModel: {
      entities: ['user', 'subreddit', 'post', 'comment', 'vote'],
      fields: {
        user: ['id', 'username', 'karma', 'created_at'],
        subreddit: ['id', 'name', 'description', 'created_at'],
        post: ['id', 'subreddit_id', 'user_id', 'title', 'content', 'score', 'created_at'],
        comment: ['id', 'post_id', 'parent_comment_id', 'user_id', 'text', 'score', 'created_at'],
        vote: ['id', 'target_id', 'target_type', 'user_id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating posts/comments
        { type: 'read_by_query', frequency: 'very_high' }, // Viewing subreddit feed
      ],
    },
  },

  scenarios: generateScenarios('reddit', problemConfigs.reddit),

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
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
subreddits = {}
posts = {}
comments = {}
votes = {}

def create_post(post_id: str, subreddit_id: str, user_id: str, title: str, content: str) -> Dict:
    """
    FR-1: Users can create posts in different subreddits
    Naive implementation - stores post in memory
    """
    posts[post_id] = {
        'id': post_id,
        'subreddit_id': subreddit_id,
        'user_id': user_id,
        'title': title,
        'content': content,
        'score': 0,
        'created_at': datetime.now()
    }
    return posts[post_id]

def create_comment(comment_id: str, post_id: str, user_id: str, text: str, parent_comment_id: Optional[str] = None) -> Dict:
    """
    FR-2: Users can comment on posts (nested comments)
    Naive implementation - stores comment with optional parent
    """
    comments[comment_id] = {
        'id': comment_id,
        'post_id': post_id,
        'parent_comment_id': parent_comment_id,
        'user_id': user_id,
        'text': text,
        'score': 0,
        'created_at': datetime.now()
    }
    return comments[comment_id]

def upvote_post(vote_id: str, post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can upvote posts
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': post_id,
        'target_type': 'post',
        'user_id': user_id,
        'value': 1,  # +1 for upvote
        'created_at': datetime.now()
    }

    # Update post score
    if post_id in posts:
        posts[post_id]['score'] += 1

    return votes[vote_id]

def downvote_post(vote_id: str, post_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can downvote posts
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': post_id,
        'target_type': 'post',
        'user_id': user_id,
        'value': -1,  # -1 for downvote
        'created_at': datetime.now()
    }

    # Update post score
    if post_id in posts:
        posts[post_id]['score'] -= 1

    return votes[vote_id]

def upvote_comment(vote_id: str, comment_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can upvote comments
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': comment_id,
        'target_type': 'comment',
        'user_id': user_id,
        'value': 1,
        'created_at': datetime.now()
    }

    # Update comment score
    if comment_id in comments:
        comments[comment_id]['score'] += 1

    return votes[vote_id]

def downvote_comment(vote_id: str, comment_id: str, user_id: str) -> Dict:
    """
    FR-3: Users can downvote comments
    Naive implementation - stores vote and updates score
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': comment_id,
        'target_type': 'comment',
        'user_id': user_id,
        'value': -1,
        'created_at': datetime.now()
    }

    # Update comment score
    if comment_id in comments:
        comments[comment_id]['score'] -= 1

    return votes[vote_id]

def get_subreddit_feed(subreddit_id: str, sort_by: str = "hot") -> List[Dict]:
    """
    Helper: Get posts from a subreddit
    Naive implementation - simple sorting by score or time
    Real Reddit uses complex ranking algorithms
    """
    subreddit_posts = []
    for post in posts.values():
        if post['subreddit_id'] == subreddit_id:
            subreddit_posts.append(post)

    # Sort by score (hot) or time (new)
    if sort_by == "hot":
        subreddit_posts.sort(key=lambda x: x['score'], reverse=True)
    else:  # new
        subreddit_posts.sort(key=lambda x: x['created_at'], reverse=True)

    return subreddit_posts
`,
};
